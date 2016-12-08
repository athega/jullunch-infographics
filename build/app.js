"use strict";$(function(){"use strict";var base="https://jullunch-backend.athega.se/",data="data/",ext=".json";window.infographics={config:{eventSourceURL:base+"stream",stateDataURL:data+"current_state"+ext,guestsDataURL:data+"latest_check_ins"+ext,companiesDataURL:data+"companies_toplist"+ext,adsURL:"https://assets.athega.se/jullunch/ads.json",maxItems:64,loopTime:30*1000,maxItemsLoopTime:60*1000,subscribedLoopTime:60*1000,slideLoopTime:20*1000,watchdogTime:30*60*1000}}});$(function(){"use strict";var i=0,j=0,$h1=$("body > h1");$h1.load($h1.find("> img").attr("src"));function update(){var si=Math.sin(i+=0.037),cj=Math.cos(j+=0.043),azimuth=Math.atan2(cj,si)*180/Math.PI,dx=-si*4,dy=-cj*4;$("#distant-light").attr("azimuth",azimuth);$("#drop-shadow").css("transform","translate("+dx+"px,"+(dy+2)+"px)");$("#edge-logo").css("transform","translate("+-dx/2+"px,"+(-dy/2-2)+"px)");update.animationFrameRequested=requestAnimationFrame(update)}$h1.on({pause:function pause(){if(update.animationFrameRequested){cancelAnimationFrame(update.animationFrameRequested);update.animationFrameRequested=false}},play:function play(){if(!update.animationFrameRequested){update.animationFrameRequested=requestAnimationFrame(update)}}})});$(function(){"use strict";var $page=$("main > #arrival"),$name=$page.find("h3"),$arrived=$page.find("span.arrived"),$arrivedCompany=$page.find("span.arrived-company"),arrivedInterval,arrivedCompanyInterval;$page.on("play",function(event){var arrivedTarget=$arrived.data("count"),arrivedCount=1;if(arrivedTarget>0){$arrived.text("\u2026");clearInterval(arrivedInterval);arrivedInterval=setInterval(function(){$arrived.text(arrivedCount);if(++arrivedCount>=arrivedTarget)clearInterval(arrivedInterval)},400-Math.min(100,arrivedTarget)*3)}var arrivedCompanyTarget=$arrivedCompany.data("count"),arrivedCompanyCount=1;if(arrivedCompanyTarget>0){$arrivedCompany.text("\u2026");clearInterval(arrivedCompanyInterval);arrivedCompanyInterval=setInterval(function(){$arrivedCompany.text(arrivedCompanyCount);if(++arrivedCompanyCount>=arrivedCompanyTarget)clearInterval(arrivedCompanyInterval)},400-Math.min(100,arrivedCompanyTarget)*3)}});$page.on("update",function(event,guest){$name.empty();for(var i in guest.name){$name.append($("<b>").html(guest.name[i]!=" "?guest.name[i]:"&nbsp;").css("animation-delay",-10+i*0.1+"s,"+i*0.4+"s"))}$page.find("span.arrived").data("count",guest.arrived).text("\u2026");$page.find("span.arrived-company").data("count",guest["arrived-company"]).text("\u2026");$page.find("span.company").text(guest.company);if(guest.arrived_at){$page.find("time").attr("datetime",guest.arrived_at).text(guest.arrived_at.split("T")[1].split(/:\d+\./)[0])}if(guest.image_url){$page.find("img").replaceWith($("<img>").css({"background-image":"url(\"images/bubble-background.png\"), url(\""+guest.image_url+"\")","background-color":d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]}))}})});$(function(){"use strict";var config=infographics.config,$page=$("main > #guests"),$list=$page.find("ol"),scrollTimeOut;$page.on("play",function(event){return $.get(config.guestsDataURL,function(guests){$list.empty().removeClass("update").stop(true).prop("scrollTop",0);guests.data.forEach(function(guest){$list.prepend($("<li>").text(guest.name).prepend($("<div>").text(guest.company)).prepend($("<img>").css({"background-image":"url(\"images/bubble-background.png\"), url(\""+(guest.image_url&&guest.image_url.indexOf(".uploads.im/")==-1?guest.image_url:"images/santa.png")+"\")","background-color":d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]})).append(guest.arrived_at&&$("<time>",{datetime:guest.arrived_at}).text(guest.arrived_at.split("T")[1].split(/:\d+\./)[0])))});$list.children().css("animation-delay",function(i){return 0+i*0.4+"s,"+(-2+i*0.4)+"s,"+(0+i*1.5)+"s"}).css("transition-delay",function(i){return 8*0.1-i*0.1+"s"});function scroll(){$list.animate({"scrollTop":scrollDirection=scrollDirection?0:scrollTopMax},{duration:scrollDuration,complete:function complete(){scrollTimeOut=setTimeout(scroll,2000)}})}var itemHeight=$list.find("li").outerHeight(true),visibleItems=$list.innerHeight()/itemHeight,scrollTopMax=$list.prop("scrollHeight")-$list.innerHeight(),scrollDelay=1.5*1000*(visibleItems-1)-500,scrollDuration=1.5*1000*scrollTopMax/itemHeight,scrollDirection;clearTimeout(scrollTimeOut);scrollTimeOut=setTimeout(scroll,scrollDelay)})});$page.on("pause",function(event){$list.empty()});$page.on("update",function(event){var update=$.Deferred();if($page.is(".active")){$list.addClass("update");setTimeout(update.resolve,1000)}else{update.resolve()}return update})});$(function(){"use strict";var config=infographics.config,$main=$("main"),$itemPages=$main.children("#mulled_wine, #drink, #food, #coffee"),$attendancePage=$main.children("#attendance");$itemPages.on("play",function(event){var $page=$(this),$list=$page.find("ul");return $.get(config.stateDataURL,function(state){var count=state.data[$page.attr("id")];$page.data("count",count);$page.find("h3").text(count);addItems($list,count)})});$attendancePage.on("play",function(event){var $page=$(this),$list=$page.find("ul");return $.get(config.stateDataURL,function(state){$page.data("count",state.data.arrived);$page.find(".arrived > h3").text(state.data.arrived);$page.find(".present > h3").text(state.data.arrived-state.data.departed);$page.find(".departed > h3").text(state.data.departed);addItems($list,state.data.arrived).eq(-state.data.departed).addClass("departed")})});$itemPages.add($attendancePage).on("pause",function(event){var $page=$(this);$page.find("ul").empty();$page.find("h3").empty()});function addItems($list,count){var rules=document.styleSheets[0].cssRules,durations=[4+3*Math.random(),1,4+3*Math.random(),4+3*Math.random(),3+2*Math.random(),3+2*Math.random()];for(var i=0;i<rules.length;i++){if(rules[i].selectorText=="ul > li"){rules[i].style["animation-duration"]=durations[0]+"s, "+durations[1]+"s, "+durations[2]+"s, "+durations[3]+"s, "+durations[4]+"s, "+durations[5]+"s";break}}var offsets=[durations[1],0,-durations[2]*(1+Math.random()),-durations[3]*(1+Math.random()),-durations[4]*(1+Math.random()),-durations[5]*(1+Math.random())],expand=0.5+-0.8*Math.sin(Math.PI/2*Math.min(config.maxItems,count)/config.maxItems),delays=[undefined,0.7+0.5*Math.random(),0.3+expand+0.2*Math.random(),0.4+expand+0.2*Math.random(),0.3+expand+0.3*Math.random(),0.4+expand+0.3*Math.random()];return $list.empty().append("<li>".repeat(Math.min(config.maxItems,count))).children().css("animation-delay",function(i){return offsets[0]+i*delays[1]+"s,"+(offsets[1]+i*delays[1])+"s,"+(offsets[2]+i*delays[2])+"s,"+(offsets[3]+i*delays[3])+"s,"+(offsets[4]+i*delays[4])+"s,"+(offsets[5]+i*delays[5])+"s"})}});$(function(){"use strict";var config=infographics.config,$page=$("main > #companies"),diameter=640,initialTransitionDuration=12000,initialTransitionDelay=2000,updateTransitionDuration=4000,updateTransitionDelay=400,randomBubblesInterval=14000,color=d3.scaleOrdinal(d3.schemeCategory10),svg=d3.select("#companies").append("svg").attr("viewBox","0 0 "+diameter+" "+diameter).attr("width",diameter).attr("height",diameter),pack=d3.pack().size([diameter,diameter]),data={children:[],companies:{}},actions={reload:function reload(event){return $.get(config.companiesDataURL,function(companies){data.children=[];data.companies={};companies.data.forEach(function(company){actions.update(undefined,company.name,company.count)})})},update:function update(event,name,count){if(data.companies[name]){data.companies[name].size=count}else{data.children.push(data.companies[name]={name:name,size:count||1})}$page.data("count",data.children.length*6);return this},pause:function pause(event){clearInterval(updateRandomBubbles.interval);updateRandomBubbles.interval=false;resetBubbles();updateBubbles.reload=true;updateBubbles.playing=false;return this},play:function play(event){if(updateBubbles.reload){updateBubbles.reload=false;return actions.reload().done(actions.play)}if(!updateRandomBubbles.interval){updateRandomBubbles();updateRandomBubbles.interval=setInterval(updateRandomBubbles,randomBubblesInterval)}if(!updateBubbles.playing){shuffle(data.children)}updateBubbles();updateBubbles.playing=true;return this}};$page.on(actions);function updateBubbles(){var root=d3.hierarchy(data).sum(function(d){return d.size}),node=svg.selectAll(".node").data(pack(root).leaves());var g1=node.enter().append("g").attr("class","node").attr("transform",function(d){return"translate("+diameter/2+","+diameter/2+") scale(0)"}).style("display",function(d){return d.data.name=="random1"||d.data.name=="random2"?"none":"inline-block"});var i=0;g1.transition().duration(initialTransitionDuration).delay(function(d){return i++*initialTransitionDelay}).ease(d3.easeBounce).attr("transform",function(d){return"translate(0,0) scale(1)"});var g2=g1.append("g").attr("transform",function(d){return"translate("+d.x+","+d.y+")"});g2.append("image").attr("xlink:href","images/bubble-background.png").attr("x",function(d){return-d.r}).attr("y",function(d){return-d.r}).attr("width",function(d){return d.r*2}).attr("height",function(d){return d.r*2});var blendModes=["color","color-burn","color-dodge","hard-light","multiply","overlay","screen","soft-light"];g2.append("circle").attr("r",function(d){return d.r}).style("mix-blend-mode",function(d){return blendModes[Math.floor(Math.random()*blendModes.length)]}).style("fill",function(d){return color(Math.random())});g2.append("text").attr("dy",".3em").style("text-anchor","middle").attr("lengthAdjust","spacingAndGlyphs").attr("textLength",function(d){return d.r*1.6}).style("font-size",function(d){return d.r*0.9-d.r*0.8*Math.min(24,d.data.name.length)/24+"px"}).text(function(d){return d.data.name});i=0;node.select("g").transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr("transform",function(d){return"translate("+d.x+","+d.y+") scale(1)"});i=0;node.select("image").transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr("x",function(d){return-d.r}).attr("y",function(d){return-d.r}).attr("width",function(d){return d.r*2}).attr("height",function(d){return d.r*2});i=0;node.select("circle").transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr("r",function(d){return d.r});i=0;node.select("text").transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).attr("textLength",function(d){return d.r*1.6}).style("font-size",function(d){return d.r*0.9-d.r*0.8*Math.min(24,d.data.name.length)/24+"px"});node.exit().remove()}function resetBubbles(){svg.selectAll(".node").remove()}function updateRandomBubbles(){actions.update(undefined,"random1",Math.random()*18+1).update(undefined,"random2",Math.random()*18+1);if(updateRandomBubbles.interval)actions.play()}function shuffle(a){for(var _i=a.length;_i;_i--){var _j=Math.floor(Math.random()*_i);var _ref=[a[_j],a[_i-1]];a[_i-1]=_ref[0];a[_j]=_ref[1]}}});$(function(){"use strict";var config=infographics.config,$pages=$("main > div");function showPrevious(){var $currentPage=$pages.filter(".active"),$prevPage=$currentPage.prev().length?$currentPage.prev():$pages.last();subscribe($prevPage);showPage($prevPage)}function showNext(){var $currentPage=$pages.filter(".active"),$nextPage=$currentPage.next().length?$currentPage.next():$pages.first();subscribe($nextPage);showPage($nextPage)}function subscribe($page){if($page.hasClass("slide"))return;subscription.$page=$page;localStorage.setItem("subscription-page","#"+$page.attr("id"));notification("Prenumererar p\xE5 h\xE4ndelser f\xF6r #"+$page.attr("id"))}function subscription($page){if($page.is(subscription.$page)||$page.is(".active")){showPage($page)}}function notification(message){var $notification=$("#notification");$notification.addClass("active").text(message);clearTimeout(notification.hideTimeoutId);notification.hideTimeoutId=setTimeout(function(){$notification.removeClass("active")},1500)}function showPage($page){history.replaceState({},"","#"+$page.attr("id"));var $currentPage=$pages.filter(".active");$currentPage.removeClass("active");$page.addClass("active");if(!$currentPage.is($page))$currentPage.triggerHandler("pause");$page.triggerHandler("play");var $logoAnimation=$("body > h1");$logoAnimation.triggerHandler(!$page.is(".slide")?"play":"pause");setRandomPageTimeout($page)}function setRandomPageTimeout($page){var time=config.loopTime,count=$page.data("count");if($page.is(subscription.$page)){time=config.subscribedLoopTime}else if($page.is(".slide")){time=config.slideLoopTime}else if(count){time=config.loopTime+Math.min(config.maxItems,count)*(config.maxItemsLoopTime-config.loopTime)/config.maxItems}clearTimeout(showRandomPage.timeoutId);showRandomPage.timeoutId=setTimeout(showRandomPage,time)}function showRandomPage(){var $loopPages=$pages.filter(".loop"),$page=$loopPages.eq(Math.floor(Math.random()*$loopPages.length));showPage($page)}function updateMulledWinePage(){subscription($pages.filter("#mulled_wine"))}function updateDrinkPage(){subscription($pages.filter("#drink"))}function updateFoodPage(){subscription($pages.filter("#food"))}function updateCoffeePage(){subscription($pages.filter("#coffee"))}function updateAttendancePage(){subscription($pages.filter("#attendance"))}function updateGuestsPage(){var $page=$pages.filter("#guests");return $page.triggerHandler("update").done(function(){subscription($page)})}function initCompaniesPage(){var $page=$pages.filter("#companies");return $page.triggerHandler("reload")}function updateCompaniesPage(company){var $page=$pages.filter("#companies");$page.triggerHandler("update",[company.name,company.count]);subscription($page)}function updateArrivalPage(guest){var $page=$pages.filter("#arrival");$page.triggerHandler("update",guest);subscription($page)}function updateDeparturePage(guest){var name="departure",$page=$pages.filter("#"+name);$page.find("span.name").text(guest.name);subscription($page)}if(config.watchdogTime)setTimeout(function(){location.reload()},config.watchdogTime);var initAds=$.get(config.adsURL,function(data){var $template=$("template#slide"),$slide=$($template.html());for(var i=0;i<data.length;i++){$slide.attr("id","slide"+(i+1));$slide.find("img").attr("src",data[i].url.replace("http://","https://"));$template.parent().append($slide.clone())}$template.remove()});$.when(initCompaniesPage(),initAds).done(function(){subscription.$page=$pages.filter(localStorage.getItem("subscription-page"));$pages=$("main > div");var $defaultPage=$pages.filter(location.hash);if($defaultPage.length)showPage($defaultPage);else showRandomPage()});$(document).on("keydown",function(event){if(event.which==37||event.which==39){if(event.which==37)showPrevious();else if(event.which==39)showNext();event.preventDefault()}});var touchX,touchY,swipe;$(window).on({touchstart:function touchstart(event){touchX=event.originalEvent.targetTouches[0].clientX;touchY=event.originalEvent.targetTouches[0].clientY;swipe=false},touchmove:function touchmove(event){var dx=event.originalEvent.targetTouches[0].clientX-touchX,dy=event.originalEvent.targetTouches[0].clientY-touchY;if(Math.abs(dx)>100&&Math.abs(dy)<Math.abs(dx)/4)swipe=Math.sign(dx)==1?"right":"left";else swipe=false;event.preventDefault()},touchend:function touchend(event){if(swipe=="right")showPrevious();else if(swipe=="left")showNext()}});var eventSource=new EventSource(infographics.config.eventSourceURL);eventSource.onerror=function(event){notification("Event source failed!");setTimeout(function(){location.href=location.pathname},12000)};function listen(event,handler){return eventSource.addEventListener("jullunch."+event,function(event){handler(JSON.parse(event.data))})}listen("guest-arrival",function(guest){updateGuestsPage();updateArrivalPage(guest)});listen("guest-departure",updateDeparturePage);listen("guests-arrived.total",updateAttendancePage);listen("guests-departed.total",updateAttendancePage);listen("company-arrived",updateCompaniesPage);listen("mulled_wine.total",updateMulledWinePage);listen("drink.total",updateDrinkPage);listen("food.total",updateFoodPage);listen("coffee.total",updateCoffeePage)});
