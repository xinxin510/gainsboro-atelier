import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import StarRating from './StarRating.jsx';
import {MdCheckCircle, MdOutlineClose} from 'react-icons/md'
import {FcCheckmark} from "react-icons/fc";

const Container = styled.div`
  border-bottom: 1px solid #b4b4b4;
  padding: 20px 0;
`;

const RatingAndName = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Image = styled.img`
  & {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    width: 200px;
    height: 120px;
    background-image: url(${props => props.url});
    background-size: cover;
    background-position: center;
    border: 1px solid #b4b4b4;
  }

 &:hover {
   opacity: 0.8;
   cursor: pointer;
 }
`;

const Modal = styled.div`
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
`;

const ModelImg = styled.img`
  margin: auto;
  display: block;
  max-width: 500px;
  max-height: 700px;
`;

export const CloseImage = styled(MdOutlineClose)`
  & {
    color: #ffffff;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 20px;
    right: 150px;
  }
  &:hover {
    color: #bbb;
    cursor: pointer;
  }
`

const ShowMoreLink = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: #B20000;
`
const VoteLink = styled.small`
  & {
    display: inline-block;
    width: 25px;
    margin-left: 5px;
    cursor: pointer;
    text-decoration: underline;
    color: #378f1e;
  }

  &:hover {
    font-weight: 900;
  }
`;

const Count = styled.small`
  margin: 0 6px;
`;

const CheckCircle = styled(MdCheckCircle)`
  color: #378f1e;s
`


const Message = styled.small`
  color: #378f1e;
  margin-left: 5px;
`;

const Segment = styled.span`
  display: inline-block;
  width: 5px;
  margin: 0 20px;
`;

const ReportLink = styled.small`
  & {
    text-decoration: underline;
  }
  &:hover {
    color: #FF0000;
    font-weight: 900
  }
`
const Reported = styled.small`
  color: #FF0000;
`;


export default class Review extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      helpfulnessVote: true,
      report: true,
      showModal: false
    }
    this.handleShowMoreBtnClick = this.handleShowMoreBtnClick.bind(this);
    this.handleVoteBtnClick = this.handleVoteBtnClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleCloseImageBtnClick = this.handleCloseImageBtnClick.bind(this);
  }

  handleImageClick(url) {
    this.setState({
      showModal: url
    })
  }

  handleShowMoreBtnClick() {
    this.setState({
      showMore: true,
    })
  }

  handleVoteBtnClick(review_id, helpfulness) {
    this.setState({
      helpfulnessVote: false
    })
    this.props.voteForReview(review_id, helpfulness);
  }

  handleReportClick(review_id) {
    axios.put(`/reviews/${review_id}/report`)
    .then(data => {
      if (data.status === 204) {
        this.setState({
          report: false
        })
      }
    })
  }

  handleCloseImageBtnClick() {
    this.setState({
      showModal: false
    })
  }

  render() {
    const {review, voteForReview} = this.props;
    const {review_id, reviewer_name, summary, body, date, helpfulness, photos, rating, recommend, response} = review;
    const dateObj = new Date(date);
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    var formatedDate = dateObj.toLocaleDateString('en-US', options);
    return (
      <Container>
        <RatingAndName>
          <span><StarRating ratings={rating}/></span>
          <small>{reviewer_name}, {formatedDate}</small>
        </RatingAndName>
        <h4>{summary}</h4>
        {body.length <= 250 ?
          <p>{body}</p> :
          !this.state.showMore ? <p>{body.slice(0, 250)}...<ShowMoreLink onClick={this.handleShowMoreBtnClick}>Show more</ShowMoreLink></p> : <p>{body}</p>
        }
        {photos.length > 0 && photos.map(photo => <Image key={photo.url} url={photo.url} onClick={() => this.handleImageClick(photo.url)} />)}
        {this.state.showModal &&
        <Modal>
          <CloseImage onClick={this.handleCloseImageBtnClick}/>
          <ModelImg src={this.state.showModal} />
        </Modal>}
        {recommend? <p><FcCheckmark /> I recommend this product</p> : ''}
        {response ? <div><h4>Response</h4><p>{response}</p></div>: ''}
        <div>
          <small>Helpful? </small>
          {this.state.helpfulnessVote ?
            <>
              <VoteLink onClick={() => this.handleVoteBtnClick(review_id, helpfulness)}>Yes</VoteLink>
              <Count>({helpfulness})</Count>
            </> :
            <>
              <Count>({helpfulness})</Count>
              <CheckCircle />
              <Message>Thank you for your feedback.</Message>
            </>
          }
          <Segment>|</Segment>
          {this.state.report ? <ReportLink onClick={() => this.handleReportClick(review_id)}>Report</ReportLink> : <Reported>Reported</Reported>}
        </div>
      </Container>
    )
  }
}