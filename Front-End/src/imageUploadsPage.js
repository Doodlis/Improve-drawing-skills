import React, { useState, useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import axios from 'axios';

export function Drawings() {
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    axios.get('http://localhost:5000/drawings/GetCategories')
    .then(function (response) {
      // handle success
      var categoryList = [];
      categories.push(Object.keys(response.data));
      setCategories(categoryList);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  });

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const onImageGetScores = (e) => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "image",
      images[0].file
    );

    // Request made to the backend api
    // Send formData object
    axios.post("http://localhost:5000/drawings/PostImage", formData);

  }

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                  <button onClick={() => onImageGetScores(image)}>Get Scores</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
