const BASE_URL = "https://api.github.com/search/repositories?q="
var isFirst = true

// returns date for last month, week or today.
function getRelativeDate(x){
  var date = new Date()
  date.setDate(date.getDate() - x);
  var d = date.toISOString().slice(0,10);
  return d;
}

// prepares api end point for hitting githb trending api.
export function getApiEndPoint(state){
	isFirst = true
	var date = state.value;
	var language = state.language
	var pageNumber = state.pageNumber
	var url = setOwner(state,setName(state,setLanguage(state,setDate(state,BASE_URL))))
	if(isFirst){
		alert("Please select atleast one filter: Duration, Language or Search Term")
	}
	url = setSort(state,url);
	return url +"&per_page=5&page="+pageNumber
}

//sort the result by star,fork and updated in asending or desending order.
function setSort(state,url){
	return url +"&sort="+state.sortBy+"&order="+state.sortOrder
}

/* Search results for date(today,week,month).If no date value provided omits 
it from search query.*/
function setDate(state,url){
	if(state.date=='all'){
		return url;
	}
	isFirst = false;
	url = url+"created:"
	switch(state.date){
		case 'today':
			return url + getRelativeDate(1)
			break;
		case 'week':
			return  url + getRelativeDate(8)
			break;
		case 'month':
			return url + getRelativeDate(31)
		default:
      return url + getRelativeDate(1) ;
  }
}

// search results for languaage selected.
function setLanguage(state,url){
	if(state.language=='all'){
		return url;
	}
	isFirst = false;
	return url+(isFirst?'':'+')+'language:' + state.language
}

//search by owner
function setOwner(state,url){
	if(!state.owner || state.owner==''){
		return url;
	}
	isFirst = false
	return url+(isFirst?'':'+')+"user:"+state.owner

}

//search repository on basis of name
function setName(state,url){
	if(!state.name || state.name==''){
		return url;
	}
	isFirst = false
	return url+(isFirst?'':'+')+state.name+" in:name"
}