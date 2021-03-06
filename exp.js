class Queue{
          constructor(){
                    this.items = []
          }
          push(e1,e2){
                    return this.items.push([e1,e2])
          }
          pop(){
                    if(this.isEmpty())
                              return "Underflow";
                    return  this.items.shift();
          }
          isEmpty(){
                    return this.items.length == 0;
          }
          size(){
                    return this.items.length
          }
          clear(){
                    this.items.length == 0;
                    return;
          }
}
class Stack{
          constructor(){
                    this.items = []
          }
          push(e1,e2){
                    return this.items.push([e1,e2])
          }
          pop(){
                    if(this.isEmpty())
                              return "Underflow";
                    return  this.items.pop();
          }
          isEmpty(){
                    return this.items.length == 0;
          }
          size(){
                    return this.items.length
          }
          clear(){
                    this.items.length == 0;
                    return;
          }
}
let Start = {row:10,col:17},End = {row:10,col:35},wall = new Set()
let xDirections = [-1,0,1,0],yDirections = [0,1,0,-1]
let ROW_COUNT = 20,COL_COUNT = 53
function createGrid(){
          let body = $("body");
          let grid = $("<div/>")
          grid.addClass('grid')
          for(let i = 0;i<ROW_COUNT;i++){
                    let row = $("<div/>").addClass("row")
                    for(let j = 0;j<COL_COUNT;j++){
                              let box = $("<div/>").addClass("Unvisited")
                              box.attr("id",`${i}-${j}`)
                              row.append(box)
                    }
                    grid.append(row)
          }
          body.append(grid)
          let startSrc = "start.png",targetSrc = "target.png";
          let startImg = $("<img/>",{src:startSrc,id: "start"}),targetImg = $("<img/>",{src:targetSrc,id:"target"})
          $(`#${Start.row}-${Start.col}`).append(startImg).addClass("start");
          $(`#${End.row}-${End.col}`).append(targetImg).addClass("target");
          return Promise.resolve()
}
function dragDrop(){
          const draggables = [$("#start")[0],$("#target")[0]],container = $(".Unvisited")
          draggables.forEach(draggable =>{
                    draggable.addEventListener('dragstart',()=>{
                              clearPath();
                              if(draggable == draggables[0])draggable.parentElement.classList.remove('start')
                              else draggable.parentElement.classList.remove('target')
                              draggable.classList.add("dragging")
                              console.log("drag start")
                    })
                    draggable.addEventListener('dragend',()=>{
                              let parent = draggable.parentElement,id = parent.getAttribute("id").split('-')
                              if(draggable == draggables[0]){
                                        Start.row = parseInt(id[0])
                                        Start.col = parseInt(id[1])
                                        parent.classList.add('start')
                              }
                              else{
                                        End.row = parseInt(id[0])
                                        End.col = parseInt(id[1])
                                        parent.classList.add('target')
                              }
                              if(parent.classList.contains('block')){
                                        wall.delete(parent.id)
                                        parent.classList.remove('block')
                              }
                              draggable.classList.remove("dragging")
                              console.log("drag end")
                    })
          })
          Array.from(container).forEach(unit =>{
                    unit.addEventListener('dragover',(e)=>{
                              e.preventDefault();
                              const draggable = $(".dragging")[0];
                              unit.append(draggable)
                    })
          })

}
function clearGrid(){
          for(let i = 0;i<ROW_COUNT;i++){
                    for(let j = 0;j<COL_COUNT;j++){
                              $(`#${i}-${j}`).attr("class","Unvisited");
                    }
          }
          $(`#${Start.row}-${Start.col}`).addClass("start");
          $(`#${End.row}-${End.col}`).addClass("target");
          wall.clear();
          console.log('grid cleared')
}
function clearPath(){
          for(let i = 0;i<ROW_COUNT;i++){
                    for(let j = 0;j<COL_COUNT;j++){
                              let id = `${i}-${j}`;
                              $(`#${id}`).removeClass(['Visited','path']).addClass('Unvisited');
                    }
          }
          console.log('path cleared')
}
function createWall(){
          const container = Array.from($(".Unvisited"))
          let isDoubleClick = false;
          container.forEach((unit)=>{
                    unit.addEventListener("click",()=>{
                              if(!unit.classList.contains('start') && !unit.classList.contains('target')){
                                        unit.classList.toggle("block")
                                        let id = unit.getAttribute("id")
                                        if(unit.classList.contains('path'))unit.classList.remove('path')
                                        if(unit.classList.contains('Visited'))unit.classList.remove('Visited');
                                        if(wall.has(id)) wall.delete(id)
                                        else wall.add(id)
                              }
                    })
                    unit.addEventListener('dblclick',()=>{
                              if(!unit.classList.contains('start') && !unit.classList.contains('target'))
                                        isDoubleClick = true
                    })
                    unit.addEventListener('mousemove',()=>{
                              if(!unit.classList.contains('start') && !unit.classList.contains('target') && isDoubleClick){
                                        unit.classList.toggle("block")
                                        if(unit.classList.contains('path'))unit.classList.remove('path')
                                        if(unit.classList.contains('Visited'))unit.classList.remove('Visited');
                                        let id = unit.getAttribute("id")
                                        if(wall.has(id))wall.delete(id)
                                        else wall.add(id)
                              }        
                    })
                    unit.addEventListener('mousedown',()=>{
                              if(!unit.classList.contains('start') && !unit.classList.contains('target'))
                                        isDoubleClick = false
                    })

          })

}
async function addClick(){
          $("a").on('click', async (e)=>{
                    if(e.target.classList[0] === 'Algo'){
                              $('body').addClass('disabled')
                              await window[e.target.name]()
                              $('body').removeClass('disabled')
                    }
                    else window[e.target.name]()
          })
          
}
 function Dfs(){
          console.log('Dfs Started')
          clearPath();
          let stack = new Stack(),dp = []
          stack.push(Start.row,Start.col)
          while(!stack.isEmpty()){
                    const [row,col] = stack.pop();
                    if(row<0 || row >= ROW_COUNT || col < 0 || col >= COL_COUNT || dp.includes(`${row}-${col}`) || wall.has(`${row}-${col}`))continue;
                    dp.push(`${row}-${col}`)
                    if(row == End.row && col == End.col)break;
                    stack.push(row,col-1);
                    stack.push(row-1,col);
                    stack.push(row,col+1);
                    stack.push(row+1,col);
          }
          console.log('Dfs Completed')
          return animate(dp,dp);
}
 function Bfs(){
          console.log('Bfs Started')
          clearPath();
          let keys = [],parentSet = new Map();
          let q = new Queue(),seen = new Set()
          q.push(Start.row,Start.col)
          while(!q.isEmpty()){
                    const [row,col] = q.pop()
                    keys.push(`${row}-${col}`)
                    if(row == End.row && col == End.col)break;
                    for(let j = 0;j<4;j++){
                              let x = row+xDirections[j],y = col+yDirections[j],id = `${x}-${y}`;
                              if(x>=0 && x< ROW_COUNT && y>=0 && y< COL_COUNT && !seen.has(id) && !wall.has(id)){
                                        seen.add(id)
                                        parentSet.set(id,`${row}-${col}`)
                                        q.push(x,y)
                              }
                    }
          }
          console.log('Bfs Completed')
          return animate(keys,parentSet);
}
 function Djikstra(){
          console.log('Djikstra Started')
          clearPath();
          let keys = [],parentSet = new Map()
          let unvisitedNodes = new Map(),seen = new Set();
          Array.from($(".Unvisited")).forEach((e)=> unvisitedNodes.set(e.id,1000))
          unvisitedNodes.set(`${Start.row}-${Start.col}`,0);
          seen.add(`${Start.row}-${Start.col}`);
          while(unvisitedNodes.size){
                    unvisitedNodes = sortByDistance(unvisitedNodes)
                    const key = unvisitedNodes.keys().next().value;
                    if(!wall.has(key)){
                              if(unvisitedNodes.get(key) == 1000)break;
                              keys.push(key)
                              if(key == `${End.row}-${End.col}`)break;
                              updateDistance(key,unvisitedNodes,parentSet,seen);          
                    }
                    unvisitedNodes.delete(key);        
                    seen.add(key);
          }
          console.log('Djikstra Completed')
          return animate(keys,parentSet)
}
 function AStar(){
          console.log('A* Started')
          clearPath()
          let keys = [],parentSet = new Map();
          let F = createHeuristics();
          let openSet = [`${Start.row}-${Start.col}`]
          F.set(`${Start.row}-${Start.col}`,{f:0,g:0,h:0})
          while(openSet.length){
                    sortByDistance(0,openSet,F);
                    let key = openSet.shift();
                    keys.push(key)
                    updateNeighbors(F,key,keys,openSet,parentSet)
                    if(key == `${End.row}-${End.col}`)break;
          }
          console.log('A* Completed')
          return animate(keys,parentSet)
}
const wait = ()=> new Promise(resolve => setTimeout(resolve, 1));
async function animate(keys,parentSet){
          console.log("Reached animate")
          let timer = 0;
          for(let id of keys){
                    await wait()
                    $(`#${id}`).attr("class","Visited")
          }
          $(`#${Start.row}-${Start.col}`).addClass("start");
          $(`#${End.row}-${End.col}`).addClass("target");
          let r =  tracePath(parentSet)
          console.log("Finished animate")
          return r;
}
async function tracePath(parentSet){
          console.log("Reached animate")
          let path = [];
          if(Array.isArray(parentSet)){
                    path = parentSet;
                    for(let id of path){
                              await wait()
                              $(`#${id}`).addClass("path").removeClass("Visited")
                    }
          }
          else{
                    let child = `${End.row}-${End.col}`
                    if(!parentSet.has(child)) return Promise.resolve()
                    while(child != `${Start.row}-${Start.col}`){
                              path.push(child);
                              child = parentSet.get(child)
                    }
                    path.push(child)
                    for(let i = path.length-1;i>=0;i--){
                              await wait()
                              $(`#${path[i]}`).addClass("path").removeClass("Visited")
                    }
          }
          console.log("Finished animate")
          return Promise.resolve();                 
}
function createHeuristics(){
          let F = new Map();
          for(let i = 0;i<23;i++){
                    for(let j = 0;j<53;j++){
                              F.set(`${i}-${j}`,{f:2000,g:1000,h:1000});
                    }
          }
          return F;
}
function updateDistance(key,map,parentSet,seen){
          let [row,col] = key.match(/\d+/g);
          row = parseInt(row),col = parseInt(col)
          for(let j = 0;j<4;j++){
                    let x = row+ xDirections[j],y = col+yDirections[j],id = `${x}-${y}`;
                    if(x>=0 && x< ROW_COUNT && y>=0 && y< COL_COUNT && !seen.has(id) && !wall.has(id)){
                              map.set(id,map.get(key)+1);
                              parentSet.set(id,key)
                    }
          }          
}
function updateNeighbors(F,current,closedSet,openSet,parentSet){
          let [row,col] = current.match(/\d+/g);
          row = parseInt(row),col = parseInt(col)
          for(let j = 0;j<4;j++){
                    let x = row+ xDirections[j],y = col+yDirections[j],neighbor = `${x}-${y}`;
                    if(x<0 || x>= ROW_COUNT || y<0 || y>= COL_COUNT || closedSet.includes(neighbor) || wall.has(neighbor))continue;
                    let gCost = F.get(current).g+1,hCost = findH(x,y);
                    if(gCost+hCost < F.get(neighbor).f || !openSet.includes(neighbor)){
                              parentSet.set(neighbor,current);
                              F.set(neighbor,{f:gCost+hCost,g:gCost,h:hCost});
                              if(!openSet.includes(neighbor))openSet.push(neighbor);
                    }
          }          
          
}
function sortByDistance(map,openSet,F){
          if(map)return new Map([...map.entries()].sort((a,b) => a[1]-b[1]));
          if(openSet)openSet.sort((a,b)=>F.get(a).f-F.get(b).f || F.get(a).h-F.get(b).h)
}
function findH(x,y){
          return Math.abs(x-End.row)+Math.abs(y-End.col)
}
function closeBtn(){
          let close = document.getElementsByClassName("closebtn");
          for (let i = 0; i < close.length; i++) {
                    close[i].onclick = function(){
                              var div = this.parentElement;
                              div.style.opacity = "0";
                              setTimeout(function(){ div.style.display = "none"; }, 600);
                    }
          }
}
window.onload = async function(){
          createGrid();
          dragDrop();
          createWall();
          addClick();
          closeBtn();
}

