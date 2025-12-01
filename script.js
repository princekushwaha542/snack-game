let board=document.querySelector(".board");
const blockHeight=50;
const blockWidth=50;
const rows=Math.floor(board.clientHeight/blockHeight);
const cols=Math.floor(board.clientWidth/blockWidth);

const blocks=[]
const snake=[{
    x:1,y:3
},{
    x:1,y:4
},{
    x:1,y:5
}]
for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        let block=document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innertext=`${row}-${col}`;
    blocks[`${row}-${col}`]=block;
    }
}