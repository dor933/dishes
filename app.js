const express=require('express');
const app=express();
const PORT=process.env.PORT
const path=require('path');
app.use(express.static(__dirname));
app.use(express.json());




const ingredientJson= [
    {
        id:1,
        name:"brocooli",
        imageurl:"https://st1.foodsd.co.il/Images/Products/large/uHmGri3t7b.jpg",
        calories:34
    }
    ,
    {
        id:2,
        name:"tomato",
        imageurl:"https://st1.foodsd.co.il/Images/Products/large/hagiSJ2GI3.jpg",
        calories:40
        
    } ,
    {
        id:3,
        name:"soysauce",
        imageurl:"https://cdn.shopify.com/s/files/1/0206/9470/products/10683_HFARM_49645309-3_grande.jpeg?v=1441105440",
        calories:12
    } ,

    {
        id:4,
        name:"Nudels",
        imageurl:"https://upload.wikimedia.org/wikipedia/commons/a/a8/Fresh_ramen_noodle_001.jpg",
        calories:138
    }


]

const Dishes= [
    {
        id:1,
        dishname:"pad thai",
        ingredients:[ingredientJson[0],ingredientJson[2],ingredientJson[3]],
        time:20,
        cookingmethod:"blabla",
        imageurl:"https://d3o5sihylz93ps.cloudfront.net/wp-content/uploads/2020/05/13165500/IMG_0006-1.jpg",
        calories:209
    }
]

app.get('',(req,res) => {
    res.sendFile(path.join(__dirname,'/index.html'))
})

app.get('/init',(req,res) => {
    res.send({
        ingredients:ingredientJson,
        dishes:Dishes,
        
    })
})

app.post('/adddish',(req,res) => {
    try {
        const dish=req.body;
        console.log(dish);
        const dishingerconverted=[];
        for(let i=0; i<dish.ingredients.length; i++){
            dishingerconverted.push(ingredientJson.find(({id}) => id===dish.ingredients[i].id))
        }

        console.log('and this is dish converted:')
        console.log(dishingerconverted)
        Dishes.push({
            id:dish.id,
            dishname:dish.name,
            ingredients:dishingerconverted,
            time:dish.time,
            cookingmethod:dish.cookingmethod,
            imageurl:dish.imageurl,
            calories:dish.calories


        })

        res.status(200).send({
            ingerdient:ingredientJson,
        dishes:Dishes
        })
    } catch(e) {
        res.status(500).send();
    }
})

app.post('/addingerdient',(req,res) => {

    try{
    const ingerdient=req.body;
    console.log(req)
    ingredientJson.push({
        id:ingerdient.id,
        name:ingerdient.name,
        imageurl:ingerdient.imageurl,
        calories:ingerdient.calories

    })

    res.status(200).send({
        ingerdient:ingredientJson,
        dishes:Dishes
    });
}
catch(e) {
    res.status(500).send();
}
})

app.listen(process.env.PORT, () => {
    console.log('app on the air in port '+PORT+'');
})





