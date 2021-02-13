  
import React, { useState,createRef, useEffect } from 'react'
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Parallax } from 'react-parallax';
import styled, { keyframes } from 'styled-components';
import Movie from "../components/Movie";
import timg from "./t.jpg";


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

function App() {

  const GET_MOVIES = gql`
    query getMovies($limit: Int) {
      movies(limit: $limit) {
        id
        medium_cover_image
      }
    }
  `;

  const mdata = [
    {
      id : 1,            
      medium_cover_image : timg
    },
    {
      id : 2,            
      medium_cover_image : timg
    },
    {
      id : 3,            
      medium_cover_image : timg
    },
    {
      id : 4,            
      medium_cover_image : timg
    },
  ]

  const [pos, setPos] = useState('top');
  const [list, setList] = useState(mdata);
  const [list2, setList2] = useState();
  let count = 12;
  const { loading, data, error } = useQuery(GET_MOVIES, {
    variables: { limit: 12 },
  });

  const { loading2, data2 } = useQuery(GET_MOVIES, {
    variables: { limit: 48 },
    onCompleted: setList2
  });

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
    if(count < 48 && list2 && Math.round(Math.floor(position)) >= (document.body.scrollHeight - document.documentElement.clientHeight) / 1.2){        
      count+=4;
      setList(before => [
        ...before,
        {
          id : list2.movies[before.length]?.id,            
          medium_cover_image : list2.movies[before.length]?.medium_cover_image
        },
        {
          id : list2.movies[before.length+1]?.id,            
          medium_cover_image : list2.movies[before.length+1]?.medium_cover_image
        },
        {
          id : list2.movies[before.length+2]?.id,            
          medium_cover_image : list2.movies[before.length+2]?.medium_cover_image
        },
        {
          id : list2.movies[before.length+3]?.id,            
          medium_cover_image : list2.movies[before.length+3]?.medium_cover_image
        },
      ])      
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", getScrollPosition);    
  },[list,list2])
  
  return (
    <Container>
      <TopbarWrapper Pos={pos} id="TopbarWrapper">
        <Topbar>
            <LogoWrapper> 
            </LogoWrapper>
            <MenuWrapper>
                <ul>
                    <li>
                      <a href="/"><span>Home</span></a>
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
      {loading ? <Loading>Loading...</Loading> : (
        <Movies>
          { list?.map(m => (
            <Movie key={m.id} id={m.id} bg={m.medium_cover_image} />
          ))}
        </Movies>
      )}
      
    </Container>
  );
};
  export default App;