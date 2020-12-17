using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Amazon.Runtime;
using Amazon.S3;
using System.IO;
using Amazon.S3.Transfer;
using Amazon.Rekognition;
using Amazon.Rekognition.Model;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System.Collections.Generic;
using System.Text.Json;
using System;
using System.Linq;

namespace Back_End.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DrawingsController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<DrawingsController> _logger;

        public DrawingsController(ILogger<DrawingsController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("PostImage")]
        public async Task<IActionResult> PostImage(IFormFile image)
        {
            var credentials = new BasicAWSCredentials("AKIA34M2WSCTLJ4BL4FW", "g84LZ+BK3ULreEERjwojjsIPuwxmMPSorrK6Amn4");
            var config = new AmazonS3Config
            {
                RegionEndpoint = Amazon.RegionEndpoint.USEast1
            };

            using var client = new AmazonS3Client(credentials, config);
            await using var newMemoryStream = new MemoryStream();
            image.CopyTo(newMemoryStream);
            var imageId = Guid.NewGuid().ToString();

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = newMemoryStream,
                Key = imageId,
                BucketName = "mvpdrawings"
            };

            var fileTransferUtility = new TransferUtility(client);
            await fileTransferUtility.UploadAsync(uploadRequest);

            using var rekognitionClient = new AmazonRekognitionClient(credentials, Amazon.RegionEndpoint.USEast1);
            var request = new DetectLabelsRequest
                {
                    Image = new Image { S3Object = new S3Object {
                        Bucket = "mvpdrawings",
                        Name = imageId
                    } },
                    MaxLabels = 500,
                    MinConfidence = 20
                };
            var response = await rekognitionClient.DetectLabelsAsync(request);

            var matchedLabelScore = response.Labels.Where(x => string.Equals(x.Name, image.FileName, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault()?.Confidence;

            //inserting into dynamodb drawings table
            using var dynamoDBClient = new AmazonDynamoDBClient(credentials, Amazon.RegionEndpoint.USEast1);

            var insertDrawingRequest = new PutItemRequest
                {
                    TableName = "drawings",
                    Item = new Dictionary<string, AttributeValue>
                        {
                            { "userName", new AttributeValue { S = "Doodlis" }},
                            { "pictureId", new AttributeValue { S = imageId }},
                            { "results", new AttributeValue { S = JsonSerializer.Serialize(response.Labels)}},
                            { "category", new AttributeValue { S = image.FileName}},
                            { "score", new AttributeValue { S = matchedLabelScore.ToString()}}
                        }
                };

            await dynamoDBClient.PutItemAsync(insertDrawingRequest);
            return Ok(matchedLabelScore);
        }
         // get all categories
        [HttpGet]
        [Route("GetCategories")]
        public string GetCategories()
        {
            return "{\"animals\": [\"cat\", \"dog\", \"bird\", \"iguana\"], \"fruits\": [\"banana\", \"apple\", \"pineapple\", \"strawberry\"]}";
        }
    }
}
