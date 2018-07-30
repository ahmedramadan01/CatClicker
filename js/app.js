// One model. two views for catList and catArea,one octopus to communicate with both view and model
// model and view mustn't connect directly

//myFirstMVC
$(function(){
  var model={
    catsData:[{name:'bosy',image:'img/cat.jpg',clicks:0},
      {name:'shisha',image:'img/cat2.jpg',clicks:0},
      {name:'orio',image:'img/cat3.jpg',clicks:0},
      {name:'borio',image:'img/cat4.jpeg',clicks:0},
      {name:'mshmsh',image:'img/cat6.jpg',clicks:0}],
    char:'',
  }
  var octopus={
    init:function(){
      const pos= document.getElementById('posUrl');
      pos.addEventListener('paste',octopus.handlePaste);
      viewForCatList.init();
      adminArea.render();
      octopus.getWrittenText();
    },
    manipulateCatsData:model.catsData,
    numOct:'',
    charOct:model.char,
    catText:'',
    lastCat:'',
    getWrittenText:function(){
      const inputCatName= document.getElementById('posName');
      inputCatName.addEventListener('keydown',function(e){
        var keyCode = e.which || e.keyCode;
        if(keyCode == 8){
          octopus.charOct= octopus.charOct.slice(0,octopus.charOct.length-1);
          console.log(octopus.charOct);
        }
      });
      inputCatName.addEventListener('keypress',function(e){
        var keyCode = e.which || e.keyCode;
        octopus.charOct+=String.fromCharCode(keyCode);
        console.log(octopus.charOct);
        //inputCatName.setAttribute('value',octopus.charOct);//bad practice
        //console.log(octopus.charOct);
      });
      inputCatName.addEventListener('dblclick',function(){
        alert('hello');
        octopus.charOct= octopus.charOct.slice(0,0);
        inputCatName.addEventListener('keypress',function(e){
          var keyCode = e.which || e.keyCode;
          //if(keyCode == 8){
            //octopus.charOct= octopus.charOct.slice(0,0);
            //octopus.charOct+=String.fromCharCode(keyCode);
            console.log(octopus.charOct);
          //}
        });

      });
    },
  handlePaste:function(e){
    e.stopPropagation();
    console.log(e);
    var clipboardData= e.clipboardData;
    console.log(clipboardData);//this is DataTransfer object
    var pastedData= clipboardData.getData('text');
    octopus.pastedData=pastedData;
  },
  pastedData:'',
    addCat:function(){
      const orderedCatList=document.getElementById('oCatList');
      for(let i=0;i < model.catsData.length;i++){
        const listEle= document.createElement('li');
        orderedCatList.append(listEle);
        listEle.classList.add('clickMe');
        listEle.textContent= model.catsData[i].name;
      }
      return orderedCatList;
    },
    addClick:function(e,i){
      e.addEventListener('click',function(){
        const changeCat= document.getElementById('changeCat');
        changeCat.setAttribute('src',model.catsData[i].image);
        document.getElementById('clicks').textContent=model.catsData[i].clicks;
        document.getElementById('catName').textContent=model.catsData[i].name;
      });
    },
    moreClicks:function(){
      const changeCat= document.getElementById('changeCat');
      let src= changeCat.getAttribute('src');
      //model.catsData
      for (catObj of octopus.manipulateCatsData) {
        if(catObj.image === src){
          catObj.clicks+=1;
          document.getElementById('clicks').textContent= catObj.clicks;
        }
      }
    }

  }
  var viewForCatList= {
    init:function(){
      viewForCatList.render();
      catArea.render();
    },
    render:function(){
      var ocList= octopus.addCat();
      var bigList=document.querySelectorAll('.clickMe');
      console.log(bigList);
      for(let i=0; i<bigList.length; i++){
        octopus.addClick(bigList[i],i);
      }
    },
  }
  var catArea= {
    render:function(){
      const changeCat= document.getElementById('changeCat');
      changeCat.addEventListener('click',function(){
        //alert('hello,world');
        octopus.moreClicks();///////////////////////////////////////////////////////////////////////////////////<<<<
      })
    }
  }
  var adminArea= {
    getValues:function(){
      const clicks= document.getElementById('clicks');
      let clicksCount= clicks.textContent
      const catName= document.getElementById('catName');
      let catText= catName.textContent;
      octopus.catText= catText;
      console.log("first "+octopus.charOct);
      console.log("second "+octopus.catText);
      const url= document.getElementById('changeCat').getAttribute('src');
      let updateMes= document.getElementsByClassName('updateMe');
      for (var i = 0; i < updateMes.length; i++) {
        switch (i) {
          case 0:
            console.log('this is '+catText);
            //updateMes[0].setAttribute('value',catText);// doesnot work .value is better
            updateMes[0].value =catText;
            break;
          case 1:
            //updateMes[1].setAttribute('value',url);
            updateMes[1].value=url;
            break;
          case 2:
            //updateMes[2].setAttribute('value',clicksCount);
            updateMes[2].value=clicksCount;
            break;
        }
      }

    },
    render:function(){
      const posClicks= document.getElementById('posClicks');
      posClicks.addEventListener('keypress',function(e){
        var keyCode = e.which || e.keyCode;
        octopus.numOct+=String.fromCharCode(keyCode);
        console.log(octopus.numOct);

      });
      const admin= document.getElementById('admin');
      admin.addEventListener('click',function(){
        adminArea.getValues();
        const catName= document.getElementById('catName');
        let catText= catName.textContent;
        //octopus.charOct= catText;
        document.getElementById('posName').setAttribute('value',catText);
        octopus.lastCat= document.getElementById('posName').getAttribute('value');
      });
      const save= document.getElementById('save');
      save.addEventListener('click',function(){
        adminArea.setValues();
        //console.log()
        const catName= document.getElementById('catName');
        let catText= catName.textContent;
        console.log('this is notAdmin '+catText);
        octopus.catText= octopus.charOct;
        const allCats= document.getElementsByClassName('clickMe');
        let pastedSrc= document.getElementById('changeCat').getAttribute('src');
        let oldClicks= document.getElementById('clicks').getAttribute('value')
        let i=0;
        for (cat of allCats) {
          if(cat.textContent==octopus.lastCat || octopus.manipulateCatsData[i].name==octopus.lastCat &&
          octopus.manipulateCatsData[i].clicks == oldClicks){
            octopus.manipulateCatsData[i].clicks= Number(octopus.numOct);
            octopus.manipulateCatsData[i].image=pastedSrc;

            cat.textContent= octopus.catText;
            document.getElementById('catName').textContent=octopus.catText;//the new cat
            document.getElementById('clicks').textContent= octopus.manipulateCatsData[i].clicks;
            octopus.manipulateCatsData[i].name = octopus.catText;
            console.log(octopus.manipulateCatsData);
          }
          i++;
        }

      });
    },
    setValues:function(){
      document.getElementById('changeCat').setAttribute('src',octopus.pastedData);
      let clicks= document.getElementById('clicks');
      let clicksCount= clicks.textContent
      let catName= document.getElementById('catName');
      let catText= catName.textContent;
      let url= document.getElementById('changeCat').getAttribute('src');
      let updateMes= document.getElementsByClassName('updateMe');
      for (var i = 0; i < updateMes.length; i++) {
        switch (i) {
          case 0:
            let catNameAdmin= octopus.charOct;
            //updateMes[0].setAttribute('value',catNameAdmin);
            //document.getElementById('posName').value(catNameAdmin);
            console.log(updateMes[0]);
            updateMes[0].value=catNameAdmin;
            console.log('this is admin ' + catNameAdmin);
            break;
          case 1:
            let catImageAdmin=updateMes[1].getAttribute('value');
            catText=catImageAdmin
            break;
          case 2:
            let clicksCountAdmin= updateMes[2].getAttribute('value');
            clicksCount= clicksCountAdmin;
            break;
        }
      }
    }
  }
  octopus.init();
}());
