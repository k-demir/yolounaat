(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,function(t,e,a){t.exports=a(26)},,,,,,function(t,e,a){},,function(t,e,a){},,function(t,e,a){},,function(t,e,a){},,function(t,e,a){},,function(t,e,a){},,function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),o=a(7),i=a.n(o),s=(a(14),a(1)),c=a(2),u=a(4),l=a(3),p=a(5),d=(a(16),function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){var t=this,e=[],a=[];return this.props.data.portions.forEach(function(n,o){o===t.props.day-1&&t.props.data.portions[o]&&t.props.data.portions[o].length>0&&(n.forEach(function(e,n){a.push([r.a.createElement("tr",{key:t.props.data.name+"-"+o+"-row-"+n,className:"portionRow"},r.a.createElement("td",{key:t.props.data.name+"-"+o+"-portion-"+n,className:"portion",onClick:function(){return t.props.toggleLikeWindow(t.props.data.name,o,n,e)}},e.meal),r.a.createElement("td",{key:t.props.data.name+"-"+o+"-price-"+n,className:"price",onClick:function(){return t.props.toggleLikeWindow(t.props.data.name,o,n,e)}},e.price))])}),e.push([r.a.createElement("div",{key:t.props.data.name},r.a.createElement("h3",{className:"restaurantTitle"},t.props.data.name),r.a.createElement("hr",{className:"restaurantHr"}),r.a.createElement("table",{key:t.props.data.name+"-"+o,className:"portionsTable"},r.a.createElement("tbody",null,a)))]))}),r.a.createElement("div",{className:"restaurant"},e)}}]),e}(n.Component)),h=(a(18),function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){var t=this;return r.a.createElement("button",{onClick:function(e){return t.props.changeDayHandler(t.props.buttonDay)},className:this.props.day===this.props.buttonDay?"dayButton selected":"dayButton"},window.innerWidth>992?{1:"Maanantai",2:"Tiistai",3:"Keskiviikko",4:"Torstai",5:"Perjantai",6:"Lauantai"}[this.props.buttonDay]:{1:"Ma",2:"Ti",3:"Ke",4:"To",5:"Pe",6:"La"}[this.props.buttonDay])}}]),e}(n.Component)),m=(a(20),function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){for(var t=[],e=1;e<7;e++)t.push(r.a.createElement(h,{key:"dayButton-"+e,buttonDay:e,day:this.props.day,changeDayHandler:this.props.changeDayHandler}));return r.a.createElement("div",{className:"dayButtonContainer"},t)}}]),e}(n.Component)),f=(a(22),function(t){function e(t){var a;return Object(s.a)(this,e),(a=Object(u.a)(this,Object(l.a)(e).call(this,t))).hoverOn=function(t){for(var e={},n=1;n<=t;n++)e["star"+n]=!0;a.setState(e)},a.state={star1:!1,star2:!1,star3:!1,star4:!1,star5:!1},a}return Object(p.a)(e,t),Object(c.a)(e,[{key:"hoverOff",value:function(){this.setState({star1:!1,star2:!1,star3:!1,star4:!1,star5:!1})}},{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"likeWindow"},r.a.createElement("div",{id:"top"},r.a.createElement("h3",{id:"portionTitle"},this.props.portion.meal),r.a.createElement("hr",{id:"hr1"})),r.a.createElement("div",{id:"bottom"},r.a.createElement("div",{className:"stars"},r.a.createElement("i",{className:this.state.star1?"fas fa-star":"far fa-star",onMouseEnter:function(){return t.hoverOn(1)},onMouseLeave:function(){return t.hoverOff()}}),r.a.createElement("i",{className:this.state.star2?"fas fa-star":"far fa-star",onMouseEnter:function(){return t.hoverOn(2)},onMouseLeave:function(){return t.hoverOff()}}),r.a.createElement("i",{className:this.state.star3?"fas fa-star":"far fa-star",onMouseEnter:function(){return t.hoverOn(3)},onMouseLeave:function(){return t.hoverOff()}}),r.a.createElement("i",{className:this.state.star4?"fas fa-star":"far fa-star",onMouseEnter:function(){return t.hoverOn(4)},onMouseLeave:function(){return t.hoverOff()}}),r.a.createElement("i",{className:this.state.star5?"fas fa-star":"far fa-star",onMouseEnter:function(){return t.hoverOn(5)},onMouseLeave:function(){return t.hoverOff()}})),this.props.portion.allergies,r.a.createElement("button",{id:"notServedButton"},"Loppunut?")))}}]),e}(n.Component)),y=(a(24),function(t){function e(t){var a;return Object(s.a)(this,e),(a=Object(u.a)(this,Object(l.a)(e).call(this,t))).handleSelectedDayChange=function(t){console.log(t),a.setState({selectedDay:t})},a.toggleDimming=function(){a.setState(function(t){return{dim:!t.dim}})},a.toggleLikeWindow=function(t,e,a,n){},a.apiUrl="http://localhost:3001/api/foods",a.state={data:[],selectedDay:(new Date).getDay(),dim:!1,displayLikeWindow:!1,likeWindowProps:{restaurantName:"",day:0,idx:0,portion:""}},a}return Object(p.a)(e,t),Object(c.a)(e,[{key:"componentDidMount",value:function(){var t=this;fetch(this.apiUrl,{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(t){return t.json()}).then(function(e){t.setState({data:e})})}},{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:this.state.dim?"dimmer active":"dimmer",onClick:this.toggleLikeWindow}),r.a.createElement(m,{day:this.state.selectedDay,changeDayHandler:this.handleSelectedDayChange}),this.state.data.map(function(e,a){return r.a.createElement(d,{key:"restaurant-"+a,data:e,day:t.state.selectedDay,toggleDimming:t.toggleDimming,toggleLikeWindow:t.toggleLikeWindow})}),this.state.displayLikeWindow?r.a.createElement(f,{restaurantName:this.state.likeWindowProps.restaurantName,day:this.state.likeWindowProps.day,idx:this.state.likeWindowProps.idx,portion:this.state.likeWindowProps.portion}):null)}}]),e}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}],[[8,2,1]]]);
//# sourceMappingURL=main.1b8fb115.chunk.js.map