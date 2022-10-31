
let counter=4;
let dishescounter=1;
const disharray=[];
const ingredientarray=[]


    $("#addrecbtn").hover(function() {           
        $(this).animate(
            { deg: 360 },
            {
              duration: 1200,
              step: function(now) {
                $(this).css({ transform: 'rotate(' + now + 'deg)' });
              }
            }
          );

    })



class ingredient {
    id;
    name;
    imageurl;
    calories;

    constructor(id1,name1,imageurl1,calories1) {
        this.id=id1;
        this.name=name1;
        this.imageurl=imageurl1;
        this.calories=calories1;
    }
    
    render() {
        return `<div class="col-4 dishmaindiv">  <label class="checkbox-inline"> <input id=${this.id} type="checkbox" value="">Add</label>
         <p class="dishespar"> ingerdient details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> dish name: ${this.name} </p> <p class="dishespar"> calories: ${this.calories} </p>  </div>`
    }

    rendertopopup() {
        return `<div class="divtorender">
         <p class="dishespar"> ingerdient details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> dish name: ${this.name} </p> <p class="dishespar"> calories: ${this.calories} </p> </div>  `
    }
}

class Dishrecipe {
    id;
    name;
    ingredients;
    time;
    cookingmetohd;
    imageurl;
    calories;

    constructor(id,name1,myingredients,time1,cookingmethod1,imageurl1,calories1){
        this.id=id;
        this.name=name1;
        this.ingredients=myingredients;
        this.time=time1;
        this.cookingmetohd=cookingmethod1;
        this.imageurl=imageurl1;
        this.calories=calories1;
    }

    render() {
        return `<div id=${this.id} class="col-12 col-lg-2 dishmaindiv"> <p class="dishespar"> Dish recipe details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> dish name: ${this.name} </p> <p class="dishespar"> cooking method:blabla </p> <p class="dishespar"> Total cooking time:${this.time} </p> <p class="dishespar"> total calories:${this.calories} </p> <p class="dishespar"> <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="showpopup(${this.id})"> Show ingredients </button> </p> </div>`
    }

    


}

function myinit(){
fetch('http://localhost:3000/init').then((response) =>  {
    response.json().then((data)=> {
         renderpage(data)
    })
})

}

function renderpage({ingredients,dishes}) {

 for(let i=0; i<dishes.length; i++) {
    disharray.push(new Dishrecipe(dishes[i].id,dishes[i].dishname,dishes[i].ingredients,dishes[i].time,dishes[i].cookingmetohd,dishes[i].imageurl,dishes[i].calories))

    document.getElementById('dishesdiv').innerHTML+=disharray[i].render();
 }


 for(let j=0; j<ingredients.length; j++){
         let indegr=ingredients[j]
          ingredientarray.push(new ingredient(indegr.id,indegr.name,indegr.imageurl,indegr.calories))
         document.getElementById('indegdiv').innerHTML+=ingredientarray[j].render();
     
 }


    
    
}

$(document).ready(function() {
    $("#addindbtn").click(function() {
        $("#dishfrm").fadeOut();
        $("#indegfrm").fadeIn();

    }) })

    $(document).ready(function() {
        $("#closeind").click(function() {
            $("#indegfrm").fadeOut();
    
        }) })

        $(document).ready(function() {
            $("#addrecbtn").click(function() {           
                $("#indegfrm").fadeOut();
                $("#dishfrm").fadeIn();
        
            })})

        $(document).ready(function() {
        $("#closedish").click(function() {$("#dishfrm").fadeOut();}) })

        $(document).ready(function() {
            $("#createind").click(function() {
                const indegrentname=document.getElementById("indname").value;
                const indimgurl=document.getElementById("indimg").value;
                const indcal=document.getElementById("indcal").value;

                addingredient(indegrentname,indimgurl,indcal)
            })
        })

        $(document).ready(function() {
            $("#createdish").click(function() {
                const checkboxinger=document.querySelectorAll("input[type='checkbox']");
                const dishingerarray=[];
                const mydishname=document.getElementById("dishname").value;
                const dishcookmet=document.getElementById("dishcookingmethod").value;
                const dishcal=document.getElementById("dishcal").value;
                const dishcookingtime=document.getElementById("dishcal").value;
                const dishimgurl=document.getElementById("dishimg").value;
                console.log(checkboxinger)


                for(let i=0; i<checkboxinger.length; i++) {
                    if(checkboxinger[i].checked){
                        const ingertoadd=ingredientarray.find(x => x.id==checkboxinger[i].id)
                        dishingerarray.push(ingertoadd);
                    }
                }

                addnewdish(mydishname,dishingerarray,dishcookmet,dishcookingtime,dishcal,dishimgurl);
            })
        })


function addnewdish(name,ingerdarray,cookingmethod,cookingtime,calor,dishimg) {

    const dishtoadd=new Dishrecipe(++dishescounter,name,ingerdarray,cookingtime,cookingmethod,dishimg,calor);
    fetch('http://localhost:3000/adddish', {
        method:'post',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify(dishtoadd)}).then((response) => {
            response.json().then((data)=> {
                   ingredientarray=data.ingerdient
                   disharray=data.dishes
                   renderpage();

            })
        })

}

function showpopup(dishid) {

    const innermodal=document.getElementById("modalinner");
    innermodal.innerHTML="";
    const relevantdish=disharray.find(x=> x.id==dishid)

    for(let i=0; i<relevantdish.ingredients.length; i++){


        const ingerdrelevant=ingredientarray.find(x=>x.id==relevantdish.ingredients[i].id)
       innermodal.innerHTML+=ingerdrelevant.rendertopopup()

    }
}

function closepopup(){
    const modal=document.getElementById("myModal");
    modal.style.display="none";

}




function addingredient(name,imageurl,calories) {

    const newingeredient=new ingredient(++counter,name,imageurl,calories)
    console.log(newingeredient)

    
    fetch('http://localhost:3000/addingerdient', {
        method:'post',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify(newingeredient)}).then((response) => {
            response.json().then((data)=> {
                   ingredientarray=data.ingerdient
                   disharray=data.dishes
                   renderpage();

            })
        })
    }

    


