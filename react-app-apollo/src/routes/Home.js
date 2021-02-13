  
import React, { useState,createRef, useEffect } from 'react'
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Parallax } from 'react-parallax';
import styled, { keyframes } from 'styled-components';
import Movie from "../components/Movie";
import timg from "./t.jpg";
import useInfiniteScroll from "react-infinite-scroll-hook";
import PropTypes from "prop-types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  aLign-items: center;
  width: 100%;
  
`;

const Header = styled.header`  
  height: 90vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  aLign-items: center;
  width: 100%;
`;
const TopbarWrapper = styled.div`  
  height: 80px;
  width: 100%;
  background-color: ${props => props.Pos === 'top' ? 'rgba( 255, 255, 255, 0 )' : 'rgba( 250, 250, 250, 1 )'};
  position:${props => props.Pos === 'top' ? 'absolute' : 'fixed'};
  box-shadow:${props => props.Pos === 'top' ? '0' : ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)'};
  z-index:999;

  & ul {
    margin:0;
    List-style: none outside;
  }

  & li {
    float:left;
    height: 80px;
    width:85px;
    text-align: center;
    line-height:80px;
  }

  & a {
    text-decoration:none;
    color:${props => props.Pos === 'top' ? '#ffffff' : '#313131'};
    font-weight:bold;
    font-size:20px;
  }
`;
const Topbar = styled.div`  
  height: 100%;
  padding-left: 50px;
  padding-right: 50px;
`;

const LogoWrapper = styled.div`  
  float:left;
`;
const MenuWrapper = styled.div`  
  float: right
`;

const Title = styled.h1`
  font-size: 100px;
  font-weight: 600;
  margin-top: 300px;
  margin-bottom: 20px;
  text-align: center;
`;

const Subtitle = styled.h3`
  font-size: 55px;
  text-align: center;
`;

const Loading = styled.div`
  font-size: 18px;
  opacity: 0.5;
  font-weight: 500;
  margin-top: 10px;
`;

const Movies = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 25px;
  width: 60%;
  position: relative;
  top: -50px;
`;

const ARRAY_SIZE = 12;
const RESPONSE_TIME = 1000;

function loadItems(prevArray = [], nextArray = [], startCursor = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      let newArray = prevArray;
      
      for (let i = startCursor; i < startCursor + ARRAY_SIZE; i++) {
        const newItem = [
          {
            id : nextArray[newArray.length]?.id,            
            medium_cover_image : nextArray[newArray.length++]?.medium_cover_image
          },
          {
            id : nextArray[newArray.length]?.id,            
            medium_cover_image : nextArray[newArray.length++]?.medium_cover_image
          },
          {
            id : nextArray[newArray.length]?.id,            
            medium_cover_image : nextArray[newArray.length++]?.medium_cover_image
          },
          {
            id : nextArray[newArray.length]?.id,            
            medium_cover_image : nextArray[newArray.length++]?.medium_cover_image
          },
      ];
        newArray = [...newArray, newItem];
      }

      resolve(newArray);
    }, RESPONSE_TIME);
  });
}

function App({scrollContainer}) {
  
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState('top');
  const [list, setList] = useState();
  const [list2, setList2] = useState();

  const renderMovies = () => {     
    const movies = list.map((m) => {
      return <Movie key={m.id} id={m.id} bg={m.medium_cover_image} />
    })
    return movies
  }

  const getScrollPosition = () => {
    const position =  document.querySelector('html').scrollTop;
    if(position > 100) setPos('scroll') 
    else {
      setPos('top');
      const target = document.getElementById('TopbarWrapper')
      
      target.animate([
        {top: '-50px'},
        {top: '0'}
      ], 200);
    }   
  };

  function handleLoadMore() {
    setLoading(true);
    loadItems(list, list2, list?.length).then(newArray => {
      setLoading(false);
      setList(newArray);
    });
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    // This value is set to "true" for this demo only. You will need to
    // get this value from the API when you request your items.
    hasNextPage: true,
    threshold: 400,
    onLoadMore: handleLoadMore,
    scrollContainer
  });


  useEffect(() => {
    let data,data2;
    (async () => {
      const url = 'https://yts.mx/api/v2/list_movies.json?sort_by=like_count&limit=12';
      const url2 = 'https://yts.mx/api/v2/list_movies.json?sort_by=like_count&limit=48';
      const response =  await fetch(url);
      const response2 =  await fetch(url2);
      data = await response.json();
      data2 = await response2.json();
    })()
    .then(()=>{
      setList(data.data.movies)
      setList2(data2.data.movies)
    })

    window.addEventListener("scroll", getScrollPosition, { passive: true });    
    return () => window.removeEventListener("scroll", getScrollPosition);
  },[pos,list,list2]) 

  return (
    <Container>
      <TopbarWrapper Pos={pos} id="TopbarWrapper">
        <Topbar>
            <LogoWrapper> 
            </LogoWrapper>
            <MenuWrapper>
                <ul>
                    <li>
                      <a><span>{pos}</span></a>
                    </li>
                    <li>
                      <a href="/"><span>Social</span></a>
                    </li>
                    <li>
                      <a href="/"><span>Service</span></a>
                    </li>
                    <li>
                      <a href="/"><span>Agent</span></a>
                    </li>
                </ul>
            </MenuWrapper>
        </Topbar>
      </TopbarWrapper>
      <Header>
          <Parallax bgImage={timg} strength={800} style={{overflow:'hidden',width:'100%',height:'100%'}}>
              <Title> Yts Movie API </Title>
              <Subtitle>I love GraphQL</Subtitle>
          </Parallax>
      </Header>
        {loading && 'Loading...'}
        <Movies ref={infiniteRef}>
          {list && renderMovies() }
        </Movies>
    
      
    </Container>
  );
};

App.propTypes = {
  scrollContainer: PropTypes.oneOf(["window", "parent"])
};

export default App;