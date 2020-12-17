import React, { useState, useEffect } from 'react';
import { Router, Link } from "@reach/router";
import ImageUploading from 'react-images-uploading';
import axios from 'axios';
// import { Menu, Dropdown, Button, message, Space, Tooltip } from 'antd';
// import { DownOutlined, UserOutlined } from '@ant-design/icons';

export function Drawings() {
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const [categoriesAndItems, setCategoriesAndItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [score, setScore] = useState(null);

  useEffect(() => {
    // Update the document title using the browser API
    axios.get('http://localhost:5000/drawings/GetCategories')
    .then(function (response) {
      // handle success
      setCategoriesAndItems(response.data);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(categoriesAndItems[category]);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

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
      images[0].file,
      selectedItem
    );

    // Request made to the backend api
    // Send formData object
    axios.post("http://localhost:5000/drawings/PostImage", formData)
    .then(function (response) {
      // handle success
      setScore(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }

  return (
    <>
      <Link to="score">Scores</Link>
      <div class="container name">DOODLE MASTER by Doodlis</div>
      <div class="container">
        {categoriesAndItems.length === 0 ? <div>Loading...</div> :
        Object.keys(categoriesAndItems).map((category) => {
          return <div class="genericButton button" onClick={() => handleCategoryClick(category)}>{category}</div>
        }
        )}
      </div>
      <div class="container">
        {selectedCategory.length === 0 ? <div></div> :
        selectedCategory.map((item) => {
          return <div class="genericButton itemButton " onClick={() => handleItemClick(item)}>{item}</div>
        }
        )}
      </div>

      {selectedItem.length === 0 ? <div></div> :
      <div className="imageUploads container">
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
                className="genericButton imageButtons"
                // style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;

              {imageList.map((image, index) => (
                <div key={index} className="image-item container">
                  <img src={image['data_url']} alt="" width="800px" />
                  <div className="image-item__btn-wrapper">
                    <button className="genericButton imageButtons" onClick={() => onImageUpdate(index)}>Update</button>
                    <button className="genericButton imageButtons" onClick={() => onImageRemove(index)}>Remove</button>
                    <button className="genericButton imageButtons" onClick={() => onImageGetScores(image)}>Get Score</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>}
      <div class="container">{score == null ? null : <div className="genericButton result">{score ? Math.round(score) + '% of this looks like a ' + selectedItem : "Try drawing it again!"}</div>}</div>
    </>
  );
}
