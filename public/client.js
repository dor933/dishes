
let dishescounter=0;
const disharray=[];
const ingredientarray=[]
let ingerdientcounter=0;



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
        this.calories=+calories1;
    }
    
    render() {
        return `<div class="col-12 col-lg-2 dishmaindiv">  <label class="checkbox-inline"> <input id=${this.id} type="checkbox" value="">Add</label>
         <p class="dishespar"> ingredient details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> Recipe name: ${this.name} </p> <p class="dishespar"> calories: ${this.calories} </p>  </div>`
    }

    rendertopopup() {
        return `<div class="divtorender">
         <p class="dishespar"> ingredient details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> Recipe name: ${this.name} </p> <p class="dishespar"> calories: ${this.calories} </p> </div>  `
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

    constructor(id,name1,myingredients,time1,cookingmethod1,imageurl1){
        this.id=id;
        this.name=name1;
        this.ingredients=myingredients;
        this.time=time1;
        this.cookingmetohd=cookingmethod1;
        this.imageurl=imageurl1;
        this.getTotalcalories(this.ingredients);
    }

    render() {
        return `<div id=${this.id} class="col-12 col-lg-2 dishmaindiv"> <p class="dishespar">  Recipe details: </p> <p class="dishespar"> <img src=${this.imageurl}> </p> <p class="dishespar"> Recipe name: ${this.name} </p> <p class="dishespar"> cooking method:blabla </p> <p class="dishespar"> Total cooking time:${this.time} </p> <p class="dishespar"> Total calories:${this.calories} </p> <p class="dishespar"> <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="showpopup(${this.id})"> Show ingredients </button> </p> </div>`
    }

    showeingerdients(){
        const dishingerdients=[];

        for(let i=0; i<this.ingredients.length; i++){


            const ingerdrelevant=ingredientarray.find(x=>x.id==this.ingredients[i].id)
           dishingerdients.push(ingerdrelevant);
    
        }

        return dishingerdients;

    }

    getTotalcalories(arrayofcalories){
        this.calories=0;

        for(let i=0; i<arrayofcalories.length; i++){


           this.calories+=arrayofcalories[i].calories
    
        }


    }
    


}

function myinit(){
fetch('/init').then((response) =>  {
    response.json().then((data)=> {
        ingerdientcounter=data.numinger;
         dishescounter=data.numdishes;
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
                const dishcookingtime=document.getElementById("dishtime").value;
                const dishimgurl=document.getElementById("dishimg").value;
                console.log(checkboxinger)


                for(let i=0; i<checkboxinger.length; i++) {
                    if(checkboxinger[i].checked){
                        const ingertoadd=ingredientarray.find(x => x.id==checkboxinger[i].id)
                        dishingerarray.push(ingertoadd);
                    }
                }

                addnewdish(mydishname,dishingerarray,dishcookmet,dishcookingtime,dishimgurl);
            })
        })


function addnewdish(name,ingerdarray,cookingmethod,cookingtime,dishimg) {

    const dishtoadd=new Dishrecipe(++dishescounter,name,ingerdarray,cookingtime,cookingmethod,dishimg);
    fetch('/adddish', {
        method:'post',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify(dishtoadd)}).then((response) => {
            response.json().then((data)=> {
                   dishescounter=data.numdishes
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
    const ingerdientstorender=relevantdish.showeingerdients();
    

    for(let i=0; i<ingerdientstorender.length; i++){


       innermodal.innerHTML+=ingerdientstorender[i].rendertopopup()

    }
}

function closepopup(){
    const modal=document.getElementById("myModal");
    modal.style.display="none";

}




function addingredient(name,imageurl,calories) {

    const newingeredient=new ingredient(++ingerdientcounter,name,imageurl,calories)

    
    fetch('/addingerdient', {
        method:'post',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify(newingeredient)}).then((response) => {
            response.json().then((data)=> {
                ingerdientcounter=data.numofingerdient
                   ingredientarray=data.ingerdient
                   disharray=data.dishes
                   renderpage();

            })
        })
    }

    


