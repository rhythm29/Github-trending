import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import {getApiEndPoint} from './url'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {date: 'today', data: [], 
      language: 'all', pageNumber:1, owner:'', 
      name:'', sortBy:'stars', sortOrder:'desc'};
    
    this.loadFromServer = this.loadFromServer.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    this.handleSortChange = this.handleSortChange.bind(this);  
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
      
  }
   //makes AJAX call to server.
  loadFromServer () {
    var xhr = new XMLHttpRequest();
    xhr.open('get',getApiEndPoint(this.state), true);
    xhr.onload = function() {
        var resData = JSON.parse(xhr.responseText);
        this.setState({ data: resData });

    }.bind(this);
    xhr.send();
  }

  handleDayChange(event) {
    this.setState({
      date: event.target.value
    },this.loadFromServer);
  }

  handleLanguageChange(event) {
    this.setState({
      language: event.target.id
    },this.loadFromServer);
  }
  
  // shows only 5 result per page, it loads next page with more results
  handleNextPage(){
     this.setState({
      pageNumber: this.state.pageNumber +1
    },this.loadFromServer); 
  }

  //shows only 5 result per page, it loads previous page.
  handlePreviousPage(){
    if(this.state.pageNumber != 1){
      this.setState({
      pageNumber: this.state.pageNumber - 1
    },this.loadFromServer); 
    }
  }
  handleSubmit(evt){
    console.log(evt.target.id)
    var obj = {owner:'',name:''}
    obj[evt.target.id] = document.getElementById('searchTerm').value;
    this.setState(obj,this.loadFromServer); 
  }

  handleSortChange(event){
    var val = event.target.value
    var arr = val.split("_")
    this.setState({
      sortBy: arr[0],
      sortOrder:arr[1]
    },this.loadFromServer);    
  }

  //loads data when omponent is loaded on DOM for first time.
  componentDidMount(){
    this.loadFromServer()
  }
  
  render() {
    return (
      <div>
      <MetaTags>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </MetaTags>
        <div className="header">
          <input type="text" placeholder="Search" className="container-1" id="searchTerm" />
          <button type="button" onClick={this.handleSubmit} id="owner">Search by owner</button>
          <button type="button" onClick={this.handleSubmit} id="name">Search by name</button>          
        </div>
        <h1 className="heading"> Trending on Github </h1>
        <select placeholder="duration" value={this.state.date} onChange={this.handleDayChange}>
          <option value="all">Trending:all</option>
          <option value="month">Trending:month</option>
          <option value="week">Trending:week</option>
          <option value="today">Trending:today</option>
        </select>
        
        <select className="sel sel--black-panther" onChange={this.handleSortChange}>
          <option value="stars_desc" className="sel__box__options">Most Stars</option>
          <option value="stars_asc">Fewest Stars</option>
          <option value="forks_desc">Most Forks</option>
          <option value="forks_asc">Fewest Forks</option>
          <option value="updated_desc">Recently Updated</option>
          <option value="updated_asc">Least Recently Updateds</option>
        </select>

        <div className="languageList">
          <ul className="langUl">
            <li className="langLl" id="all" onClick={this.handleLanguageChange} > All Languages</li>
            <li className="langLl" onClick={this.handleLanguageChange} id="ruby">Ruby</li>
            <li className="langLl" onClick={this.handleLanguageChange} id="c++"> C++</li>
            <li className="langLl" onClick={this.handleLanguageChange} id="html"> HTML </li>
            <li className="langLl" onClick={this.handleLanguageChange} id="java"> Java </li>
            <li className="langLl" onClick={this.handleLanguageChange} id="javascript"> Javascript </li>
            <li className="langLl" onClick={this.handleLanguageChange} id="php">php </li>
            <li className="langLl" onClick={this.handleLanguageChange} id="python"> Python</li>
          </ul>
        </div>

        <ol className="list">
          {this.state && this.state.data &&  this.state.data['items'] && this.state.data['items'].map(item =>
          <li className="repoList">
            <div className ="name"><a href={item.html_url} className="noUnderline">{item.full_name}</a></div>
            <div className = "description">{item.description}</div>
            <div>
               <span className="setPadding"> {item.language}  </span>
               <svg aria-label="star" class="octicon octicon-star" height="16" role="img" version="1.1" 
               viewBox="0 0 14 16" width="14">
               <path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z">
               </path></svg>
               <span className="setPadding"> {item.stargazers_count} </span>
               <svg aria-label="fork" class="octicon octicon-repo-forked" height="16" role="img" version="1.1" viewBox="0 0 10 16" width="10"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z">
               </path></svg>
               <span className="setPadding"> {item.forks}</span>
               <span className="setPadding">Built by
                <a href={item.owner.html_url}><img src={item.owner.avatar_url} className="logo" />
                </a>
               </span>
            </div>
          </li>
         )}
        </ol>
        <div className="scroll">
          <button type = "button" className="scroll" onClick = {this.handlePreviousPage}>Previous </button>
          <button type = "button" className="scroll" onClick = {this.handleNextPage}>Next </button>
        </div>
      </div>
    );
  }
}
export default App;