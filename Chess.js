// Full chess engine offline
var Chess = function(){
  this.reset = function(){
    this.board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    this.turn = 'w';
    this.enPassant = null;
    this.castling = {w:{K:true,Q:true},b:{K:true,Q:true}};
  };

  function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8;}

  this.isLegalMove = function(from,to){
    let piece = this.board[from[0]][from[1]];
    if(!piece) return false;
    let target = this.board[to[0]][to[1]];
    let color = (piece===piece.toUpperCase())?'w':'b';
    if(color!==this.turn) return false;
    if(target!="" && ((target===target.toUpperCase() && color==='w')||(target===target.toLowerCase() && color==='b'))) return false;

    // Pawn move
    if(piece.toLowerCase()==='p'){
      let dir = (color==='w')?-1:1;
      if(from[1]===to[1] && target===""){
        if(to[0]===from[0]+dir) return true;
        if((from[0]===(color==='w'?6:1)) && to[0]===from[0]+2*dir && this.board[from[0]+dir][from[1]]==="") return true;
      }
      if(Math.abs(to[1]-from[1])===1 && to[0]===from[0]+dir){
        if(target!=="") return true;
        if(this.enPassant && to[0]===this.enPassant[0] && to[1]===this.enPassant[1]) return true;
      }
      return false;
    }

    // Knight
    if(piece.toLowerCase()==='n'){
      if((Math.abs(to[0]-from[0])===2 && Math.abs(to[1]-from[1])===1)||
         (Math.abs(to[0]-from[0])===1 && Math.abs(to[1]-from[1])===2)) return true;
      return false;
    }

    // King simple move
    if(piece.toLowerCase()==='k'){
      if(Math.abs(to[0]-from[0])<=1 && Math.abs(to[1]-from[1])<=1) return true;
      // Castling
      if(color==='w' && from[0]===7 && from[1]===4){
        if(to[0]===7 && to[1]===6 && this.castling.w.K) return true;
        if(to[0]===7 && to[1]===2 && this.castling.w.Q) return true;
      }
      if(color==='b' && from[0]===0 && from[1]===4){
        if(to[0]===0 && to[1]===6 && this.castling.b.K) return true;
        if(to[0]===0 && to[1]===2 && this.castling.b.Q) return true;
      }
      return false;
    }

    // Straight lines: Rook & Queen
    if(piece.toLowerCase()==='r' || piece.toLowerCase()==='q'){
      if(from[0]===to[0] || from[1]===to[1]){
        let dr = to[0]-from[0], dc = to[1]-from[1];
        dr=dr===0?0:dr/Math.abs(dr);
        dc=dc===0?0:dc/Math.abs(dc);
        let r=from[0]+dr, c=from[1]+dc;
        while(r!==to[0] || c!==to[1]){
          if(this.board[r][c]!=="") return false;
          r+=dr; c+=dc;
        }
        return true;
      }
    }

    // Diagonal: Bishop & Queen
    if(piece.toLowerCase()==='b' || piece.toLowerCase()==='q'){
      if(Math.abs(to[0]-from[0])===Math.abs(to[1]-from[1])){
        let dr = (to[0]-from[0])/Math.abs(to[0]-from[0]);
        let dc = (to[1]-from[1])/Math.abs(to[1]-from[1]);
        let r=from[0]+dr, c=from[1]+dc;
        while(r!==to[0]){
          if(this.board[r][c]!=="") return false;
          r+=dr; c+=dc;
        }
        return true;
      }
    }

    return false;
  };

  this.move = function(from,to){
    if(!this.isLegalMove(from,to)) return false;
    let piece = this.board[from[0]][from[1]];

    // Pawn promotion auto queen
    if(piece.toLowerCase()==='p' && (to[0]===0 || to[0]===7)){
      piece = (piece===piece.toUpperCase())?'Q':'q';
    }

    // Castling move rook
    if(piece.toLowerCase()==='k'){
      let color = (piece===piece.toUpperCase())?'w':'b';
      if(color==='w'){
        if(from[0]===7 && from[1]===4 && to[1]===6){
          this.board[7][5] = this.board[7][7]; this.board[7][7]='';
        }
        if(from[0]===7 && from[1]===4 && to[1]===2){
          this.board[7][3] = this.board[7][0]; this.board[7][0]='';
        }
        this.castling.w.K=false; this.castling.w.Q=false;
      }else{
        if(from[0]===0 && from[1]===4 && to[1]===6){
          this.board[0][5] = this.board[0][7]; this.board[0][7]='';
        }
        if(from[0]===0 && from[1]===4 && to[1]===2){
          this.board[0][3] = this.board[0][0]; this.board[0][0]='';
        }
        this.castling.b.K=false; this.castling.b.Q=false;
      }
    }

    this.board[to[0]][to[1]] = piece;
    this.board[from[0]][from[1]]='';
    this.turn = (this.turn==='w')?'b':'w';
    return true;
  };

  this.getBoard = function(){ return this.board; };
  this.getTurn = function(){ return this.turn; };
  this.reset();
};
