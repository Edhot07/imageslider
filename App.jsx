import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './components/Navbar';

function App() {
  const [datas, setDatas] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photIndex, setPhotIndex] = useState(0);
  const [photosPerPage, setPhotosPerPage] = useState(getPhotosPerPage());


  function getPhotosPerPage() { 
    const width = window.innerWidth;
    if (width < 576) return 4;
    if (width < 768) return 6;
    if (width < 992) return 8;
    if (width < 1200) return 12;
    return 19;
  }




  const fetchData = async () => {
    let a = await fetch('https://gist.githubusercontent.com/pratikbutani/20ded7151103bb30737e2ab1b336eb02/raw/be1391e25487ded4179b5f1c8eedb81b01226216/country-flag.json');
    let beforeUniqueId = await a.json();
    let data = beforeUniqueId.map(item => ({
      ...item,
      id: uuidv4(),
    }));

    setDatas(data);
    if (data.length > 0 && photo === null && countryName === null) {
      setPhoto(data[0].flag);
      setCountryName(data[0].country);
      setSelectedPhoto(data[0].id);
    }
  };

  useEffect(() => {
    fetchData();
    const handleResize = () => {
      setPhotosPerPage(getPhotosPerPage());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };


  }, []);

  const handleClick = (id, url, country) => {
    console.log(id, url, country);
    let newIndex = datas.findIndex(item => {
      return item.id === id;
    });
    setPhotIndex(newIndex);
    setSelectedPhoto(id);
    setCountryName(country);
    setPhoto(url);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - photosPerPage);
    }
  };

  const handleNext = () => {
    if (currentIndex + photosPerPage < datas.length) {
      setCurrentIndex(currentIndex + photosPerPage);
    }
  };

  const handdlePhotoPrevious = () => {
    if (photIndex > 0) {
      let newIndex = photIndex - 1;
      handleClick(datas[newIndex].id, datas[newIndex].flag, datas[newIndex].country);
      console.log(`See this: ${newIndex} < ${currentIndex}`);
      if (newIndex < currentIndex) {
        handlePrevious();
      }
    }
  };

  const handdlePhotoNext = () => {
    if (photIndex + 1 < datas.length) {
      let newIndex = photIndex + 1;
      handleClick(datas[newIndex].id, datas[newIndex].flag, datas[newIndex].country);
      if (newIndex >= currentIndex + photosPerPage) {
        handleNext();
      }
    }
  };

  const displayedPhotos = datas.slice(currentIndex, currentIndex + photosPerPage);

  return (
    <>
      <Navbar />
      <div className="prevnext">
        <button className="previous" onClick={handlePrevious}><span className="material-symbols-outlined">arrow_back_ios</span></button>
        <div className="container">
          {displayedPhotos.map(item => (
            <div key={item.id} className="Galery">
              <div>
                <li>
                  <a href="#"> <img onClick={(e) => handleClick(item.id, item.flag, item.country)} id={item.id} src={item.flag} alt="Pic" className={item.id === selectedPhoto ? 'selected' : ''}/></a>
                </li>
              </div>
            </div>
          ))}
        </div>
        <button className="next" onClick={handleNext}><span className="material-symbols-outlined">arrow_forward_ios</span></button>
      </div>
      <div className="Countries">
        <button id='PhotoPrevious' onClick={handdlePhotoPrevious}><span className="material-symbols-outlined">arrow_back_ios</span></button>
        <div className="Image">
          <div id="Changeme"><img src={photo} alt="Selected Country" /></div>
          <div><h2>{countryName}</h2></div>
        </div>
        <button id='PhotoNext' onClick={handdlePhotoNext}><span className="material-symbols-outlined">arrow_forward_ios</span></button>
      </div>
    </>
  );
}

export default App;