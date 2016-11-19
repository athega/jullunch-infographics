'use strict';$(function(){'use strict';var eventSourceURL='https://jullunch-backend.athega.se/stream',stateDataURL='https://jullunch-backend.athega.se/current_state',guestsDataURL='https://jullunch-backend.athega.se/latest_check_ins',companiesDataURL='data/companies.json',adsURL='https://assets.athega.se/jullunch/ads.json',eventSource=new EventSource(eventSourceURL),maxItems=64,loopTime=30000,maxItemsLoopTime=60000,subscribedLoopTime=60000,slideLoopTime=20000,watchdogTime=30*60*1000,$pages=$('main > div');function showPrevious(){var $currentPage=$pages.filter('.active'),$prevPage=$currentPage.prev().length?$currentPage.prev():$pages.last();subscribe($prevPage);showPage($prevPage)}function showNext(){var $currentPage=$pages.filter('.active'),$nextPage=$currentPage.next().length?$currentPage.next():$pages.first();subscribe($nextPage);showPage($nextPage)}function subscribe($page){if($page.hasClass('slide'))return;subscription.$page=$page;localStorage.setItem('subscription-page','#'+$page.attr('id'));notification('Prenumererar p\xE5 h\xE4ndelser f\xF6r #'+$page.attr('id'))}function subscription($page){if($page.is(subscription.$page)){showPage(subscription.$page)}}function notification(message){var $notification=$('#notification');$notification.addClass('active').text(message);clearTimeout(notification.hideTimeoutId);notification.hideTimeoutId=setTimeout(function(){$notification.removeClass('active')},1500)}function showPage($page){history.replaceState({},'','#'+$page.attr('id'));$pages.removeClass('active');$page.addClass('active');if(window.logoAnimation){if(!$page.is('.slide'))logoAnimation.play();else logoAnimation.pause()}if(window.companiesBubbles){if($page.is('#companies'))companiesBubbles.play();else companiesBubbles.pause()}setRandomPageTimeout($page)}function setRandomPageTimeout($page){var time=loopTime,count=$page.data('count');if($page.is(subscription.$page)){time=subscribedLoopTime}else if($page.is('.slide')){time=slideLoopTime}else if(count){time=loopTime+Math.min(maxItems,count)*(maxItemsLoopTime-loopTime)/maxItems}clearTimeout(showRandomPage.timeoutId);showRandomPage.timeoutId=setTimeout(showRandomPage,time)}function showRandomPage(){var $loopPages=$pages.filter('.loop'),$page=$loopPages.eq(Math.floor(Math.random()*$loopPages.length));showPage($page)}function updatePage(name,count){var $page=$pages.filter('#'+name),$list=$page.find('ul');$page.data('count',count);$page.find('h3').text(count);addItems($list,count);subscription($page)}function updateAttendancePage(update){var name='attendance',$page=$pages.filter('#'+name),data=$page.data(),$list=$page.find('ul');$page.data(update);$page.data('count',data.arrived);$page.find('.arrived > h3').text(data.arrived);$page.find('.present > h3').text(data.arrived-data.departed);$page.find('.departed > h3').text(data.departed);addItems($list,data.arrived).eq(-data.departed).addClass('departed');subscription($page)}function addItems($list,count){var rules=document.styleSheets[0].cssRules,durations=[4+3*Math.random(),1,4+3*Math.random(),4+3*Math.random(),3+2*Math.random(),3+2*Math.random()];for(var i=0;i<rules.length;i++){if(rules[i].selectorText=='ul > li'){rules[i].style['animation-duration']=durations[0]+'s, '+durations[1]+'s, '+durations[2]+'s, '+durations[3]+'s, '+durations[4]+'s, '+durations[5]+'s';break}}var offsets=[durations[1],0,-durations[2]*(1+Math.random()),-durations[3]*(1+Math.random()),-durations[4]*(1+Math.random()),-durations[5]*(1+Math.random())],expand=0.5+-0.8*Math.sin(Math.PI/2*Math.min(maxItems,count)/maxItems),delays=[undefined,0.7+0.5*Math.random(),0.3+expand+0.2*Math.random(),0.4+expand+0.2*Math.random(),0.3+expand+0.3*Math.random(),0.4+expand+0.3*Math.random()];return $list.empty().append('<li>'.repeat(Math.min(maxItems,count))).children().css('animation-delay',function(i){return offsets[0]+i*delays[1]+'s,'+(offsets[1]+i*delays[1])+'s,'+(offsets[2]+i*delays[2])+'s,'+(offsets[3]+i*delays[3])+'s,'+(offsets[4]+i*delays[4])+'s,'+(offsets[5]+i*delays[5])+'s'})}function updateGuestsPage(guest){var name='guests',$page=$pages.filter('#'+name),$list=$page.find('ol');$list.prepend($('<li>').text(guest.name+', '+guest.company));subscription($page)}updateCompaniesPage.companies={};function updateCompaniesPage(company){var name='companies',$page=$pages.filter('#'+name);updateCompaniesPage.companies[company.name]=company.arrived;$page.data('count',Object.keys(updateCompaniesPage.companies).length*6);if(window.companiesBubbles)companiesBubbles.update(company.name,company.arrived);subscription($page)}function updateArrivalPage(guest){var name='arrival',$page=$pages.filter('#'+name),$photo=$page.find('img');$page.find('span.name').text(guest.name);$page.find('span.arrived').text(guest.arrived);$page.find('span.arrived-company').text(guest['arrived-company']);$page.find('span.company').text(guest.company);$photo.attr('src',guest.img_url);subscription($page)}function updateDeparturePage(guest){var name='departure',$page=$pages.filter('#'+name);$page.find('span.name').text(guest.name);subscription($page)}if(watchdogTime)setTimeout(function(){location.reload()},watchdogTime);var initState=$.get(stateDataURL,function(state){updatePage('mulled_wine',state.data.mulled_wine);updatePage('food',state.data.food);updatePage('drink',state.data.drink);updatePage('coffee',state.data.coffee);updateAttendancePage({arrived:state.data.arrived,departed:state.data.departed})});var initGuests=$.get(guestsDataURL,function(guests){guests.data.forEach(updateGuestsPage)});var initCompanies=$.get(companiesDataURL,function(companies){companies.forEach(updateCompaniesPage)});var initAds=$.get(adsURL,function(data){var $template=$('template#slide'),$slide=$($template.html());for(var i=0;i<data.length;i++){$slide.attr('id','slide'+(i+1));$slide.find('img').attr('src',data[i].url.replace('http://','https://'));$template.parent().append($slide.clone())}$template.remove()});$.when(initState,initGuests,initCompanies,initAds).done(function(){subscription.$page=$pages.filter(localStorage.getItem('subscription-page'));$pages=$('main > div');var $defaultPage=$pages.filter(location.hash);if($defaultPage.length)showPage($defaultPage);else showRandomPage()});$(document).on('keydown',function(event){if(event.which==37||event.which==39){if(event.which==37)showPrevious();else if(event.which==39)showNext();event.preventDefault()}});var touchX,touchY,swipe;$(window).on({touchstart:function touchstart(event){touchX=event.originalEvent.targetTouches[0].clientX;touchY=event.originalEvent.targetTouches[0].clientY;swipe=false},touchmove:function touchmove(event){var dx=event.originalEvent.targetTouches[0].clientX-touchX,dy=event.originalEvent.targetTouches[0].clientY-touchY;if(Math.abs(dx)>100&&Math.abs(dy)<Math.abs(dx)/4)swipe=Math.sign(dx)==1?'right':'left';else swipe=false;event.preventDefault()},touchend:function touchend(event){if(swipe=='right')showPrevious();else if(swipe=='left')showNext()}});eventSource.onerror=function(event){notification('Event source failed!');setTimeout(function(){location.href=location.pathname},12000)};function listen(event,handler){return eventSource.addEventListener('jullunch.'+event,function(event){handler(JSON.parse(event.data))})}listen('guest-arrival',function(guest){updateGuestsPage(guest);updateArrivalPage(guest)});listen('guest-departure',updateDeparturePage);listen('guests-arrived.total',function(data){updateAttendancePage({arrived:data.count})});listen('guests-departed.total',function(data){updateAttendancePage({departed:data.count})});listen('company-arrived',updateCompaniesPage);listen('mulled_wine.total',function(data){updatePage('mulled_wine',data.count)});listen('drink.total',function(data){updatePage('drink',data.count)});listen('food.total',function(data){updatePage('food',data.count)});listen('coffee.total',function(data){updatePage('coffee',data.count)})});
'use strict';$(function(){'use strict';var i=0,j=0,$h1=$('body > h1');$h1.load($h1.find('> img').attr('src'));function update(){var si=Math.sin(i+=0.037),cj=Math.cos(j+=0.043),azimuth=Math.atan2(cj,si)*180/Math.PI,dx=-si*4,dy=-cj*4;$('#distant-light').attr('azimuth',azimuth);$('#drop-shadow').css('transform','translate('+dx+'px,'+(dy+2)+'px)');$('#edge-logo').css('transform','translate('+-dx/2+'px,'+(-dy/2-2)+'px)');update.animationFrameRequested=requestAnimationFrame(update)}window.logoAnimation={pause:function pause(){if(update.animationFrameRequested){cancelAnimationFrame(update.animationFrameRequested);update.animationFrameRequested=false}},play:function play(){if(!update.animationFrameRequested){update.animationFrameRequested=requestAnimationFrame(update)}}}});
'use strict';$(function(){'use strict';var diameter=640,initialTransitionDuration=12000,initialTransitionDelay=2000,updateTransitionDuration=4000,updateTransitionDelay=400,randomBubblesInterval=14000,color=d3.scaleOrdinal(d3.schemeCategory10),svg=d3.select('#companies').append('svg').attr('viewBox','0 0 '+diameter+' '+diameter).attr('width',diameter).attr('height',diameter),pack=d3.pack().size([diameter,diameter]),data={children:[],companies:{}};window.companiesBubbles={update:function update(name,arrived){if(data.companies[name]){data.companies[name].size=arrived}else{data.children.push(data.companies[name]={name:name,size:Math.random()*12+1})}return this},pause:function pause(){clearInterval(updateRandomBubbles.interval);updateRandomBubbles.interval=false;resetBubbles();updateBubbles.playing=false;return this},play:function play(){if(!updateRandomBubbles.interval){companiesBubbles.update('random1',0).update('random2',0);updateRandomBubbles.interval=setInterval(updateRandomBubbles,randomBubblesInterval)}if(!updateBubbles.playing){shuffle(data.children)}updateBubbles();updateBubbles.playing=true;return this}};function updateBubbles(){var root=d3.hierarchy(data).sum(function(d){return d.size}),node=svg.selectAll('.node').data(pack(root).leaves());var g1=node.enter().append('g').attr('class','node').attr('transform',function(d){return'translate('+diameter/2+','+diameter/2+') scale(0)'}).style('display',function(d){return d.data.name=='random1'||d.data.name=='random2'?'none':'inline-block'});var i=0;g1.transition().duration(initialTransitionDuration).delay(function(d){return i++*initialTransitionDelay}).ease(d3.easeBounce).attr('transform',function(d){return'translate(0,0) scale(1)'});var g2=g1.append('g').attr('transform',function(d){return'translate('+d.x+','+d.y+')'});g2.append('image').attr('xlink:href','images/bubble-background.png').attr('x',function(d){return-d.r}).attr('y',function(d){return-d.r}).attr('width',function(d){return d.r*2}).attr('height',function(d){return d.r*2});var blendModes=['color','color-burn','color-dodge','hard-light','multiply','overlay','screen','soft-light'];g2.append('circle').attr('r',function(d){return d.r}).style('mix-blend-mode',function(d){return blendModes[Math.floor(Math.random()*blendModes.length)]}).style('fill',function(d){return color(Math.random())});g2.append('text').attr('dy','.3em').style('text-anchor','middle').attr('lengthAdjust','spacingAndGlyphs').attr('textLength',function(d){return d.r*1.6}).style('font-size',function(d){return d.r*0.9-d.r*0.8*Math.min(24,d.data.name.length)/24+'px'}).text(function(d){return d.data.name});i=0;node.select('g').transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr('transform',function(d){return'translate('+d.x+','+d.y+') scale(1)'});i=0;node.select('image').transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr('x',function(d){return-d.r}).attr('y',function(d){return-d.r}).attr('width',function(d){return d.r*2}).attr('height',function(d){return d.r*2});i=0;node.select('circle').transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).ease(d3.easeBounce).attr('r',function(d){return d.r});i=0;node.select('text').transition().duration(updateTransitionDuration).delay(function(d){return i++*updateTransitionDelay}).attr('textLength',function(d){return d.r*1.6}).style('font-size',function(d){return d.r*0.9-d.r*0.8*Math.min(24,d.data.name.length)/24+'px'});node.exit().remove()}function resetBubbles(){svg.selectAll('.node').remove()}function updateRandomBubbles(){companiesBubbles.update('random1',Math.random()*18+1).update('random2',Math.random()*18+1).play()}function shuffle(a){for(var i=a.length;i;i--){var j=Math.floor(Math.random()*i);var _ref=[a[j],a[i-1]];a[i-1]=_ref[0];a[j]=_ref[1]}}});
