import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

const app=express();
const port=3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render("index.ejs");

});


app.post("/submit",(req,res)=>{
    const ed=[];
    const sols=req.body;
    var edges=sols.edges.split(".");
    edges.pop();
    var size=0;
    for (var i=0;i<edges.length;i++){
        var l=(edges[i].split(","));
        var fd=l[0].replace(/\r?\n|\r/g, '');
        l[0]=fd;
        l=l.map(Number);
        size=Math.max(size,l[0],l[1]);
        ed.push(l);
    }
var graph = new Array(size+1);


for (let i = 0; i <= size; i++) {
    graph[i] = new Array(size+1).fill(0); 
}
var src;
var des;
var wei;
for (var i = 0; i < ed.length; i++) {
   src=ed[i][0];
   des=ed[i][1];
   wei=ed[i][2];
   graph[src][des]=wei;
}
var sourcenode=req.body.source;
var result;
if (req.body.select==='dijkstra'){
    result=dijkstra(graph,sourcenode);
}
else{
    result = bellmanFord(graph,sourcenode)
}
res.render("index.ejs",{result:result,sourcenode:sourcenode,algo:req.body.select});
console.log(req.body,result);
});
function findminivertex(process,distance)
{   var vertex=0;
    let min=Infinity;
    for(let i=0;i<process.length;i++)
        {
            if(process[i]==0 && distance[i]<min)
                {
                    vertex=i;
                    min=distance[i];
                }
            
        }
        return vertex;
}
function dijkstra(graph,source)
{
let v = graph.length;
  let process=Array(v);
    let parent=Array(v);
    let distance=Array(v);
    for(let i=0;i<v;i++)
        {
            process[i]=0;
            parent[i]="NA";
            distance[i]=Infinity;
        }
    distance[source]=0;
    for(let j=0;j<process.length-1;j++)
        {
    let minvertex=findminivertex(process,distance);
    process[minvertex]=1
    for(let i=0;i<process.length;i++)
        {
            if(process[i]==0 && distance[minvertex]!=Infinity && graph[minvertex][i]!=0 && distance[i]>graph[minvertex][i]+distance[minvertex])
                {
                    distance[i] = graph[minvertex][i]+distance[minvertex];
                    parent[i]=minvertex;
        }
        
}
        }
return [distance,parent];
}
function bellmanFord(graph, src) {
    let size = graph.length;
    let distance = Array(size).fill(Infinity);
    
    distance[src] = 0;


    for (let i = 0; i < size - 1; i++) {
            if (distance[i] != Infinity) {
                for (let v = 0; v < size; v++) {
                    if (graph[i][v] != 0 && distance[i] + graph[i][v] < distance[v]) {
                        distance[v] = distance[i] + graph[i][v];
                    }
                } 
        }
    }


    for (let u = 0; u < size-1; u++) {
            if (graph[src][u]!==0 && distance[src] + graph[src][u] < distance[u] && u!==src) {
                console.log("negeative cycle in graph");
                return [0]; 
            }
    }

    return distance;
}
app.listen(port,()=>{
    console.log(`listing on port ${port}`);
});