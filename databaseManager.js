var mysql = require('mysql');
var HttpResult = require('./HttpResult');

var pool = mysql.createPool({  //连接池
	host:'localhost',
	user:'root',
	password:'123456',
	port:'3306',
	database:'mystudy'
})

exports.getItemList = function(req,res){
	var httpResult=new HttpResult();
	pool.getConnection(function(err,conn){
		if(err){
            console.log('与mysql数据库建立连接失败');

            httpResult.code = -1;
			httpResult.description = '数据库操作失败！'
			res.send(httpResult);
		}else{
            console.log('与mysql数据库建立连接成功');
            try{
				var selectSQL= "select * from usersinfo";
				conn.query(selectSQL,function(err,results){		
					if(err){			
						httpResult.code=-1;
						httpResult.description="数据库操作失败！"			
					}else{		
						httpResult.code=1;
						httpResult.data=results
					}
                    console.log('selectSQL: '+ httpResult.code);
                    res.send(httpResult);
					conn.release();								
				})
			}
			catch(e){				
				httpResult.code=-2;
				httpResult.data=e;
				res.send(httpResult);
			}			
		}
	});	
}

exports.addItem = function(req,res){
	var httpResult=new HttpResult();
	pool.getConnection(function(err,conn){
		if(err){
			httpResult.code = -1;
			httpResult.description = '数据库操作失败！'
			res.send(httpResult);
		}else{			
			try{
				var insertSQL = "insert usersinfo (name,phone,sex,address,message) values ('"+req.body.params.name+"','"+req.body.params.phone+"','"+req.body.params.sex+"','"+req.body.params.address+"','"+req.body.params.message+"')" ;
                conn.query(insertSQL,function(err,results){
					if(err){
						httpResult.code = -1;
						httpResult.description = '数据库操作失败！'
					}else{			
						httpResult.code = 1;
						httpResult.data = true;
					}
                    res.send(httpResult);
					conn.release();
				})	
			}
			catch(e){
				httpResult.code=-2;
				httpResult.data=e;
				res.send(httpResult);
			}
		}
	})	
}

exports.setPagination = function(req,res){
	var httpResult=new HttpResult();
	pool.getConnection(function(err,conn){
		if(err){
			httpResult.code = -1;
			httpResult.description = '数据库操作失败！'
			res.send(httpResult);
		}else{
			try{
				var selectSQL= "select * from usersinfo";
				conn.query(selectSQL,function(err,results){
			        if(err){            
			            httpResult.code = -1;
			            httpResult.description = '数据库操作失败！';                 
			        }else{   
			            var pageindex = req.params.pageindex;
			            var pagesize = req.params.pagesize;
			            var startIndex = (pageindex-1)*pagesize;
			            var endIndex = pageindex*pagesize;
			            if(endIndex>results.length){
			                endIndex = results.length;
			            }
			            var curResult = results.slice(startIndex,endIndex)
			            httpResult.code = 1;
			            httpResult.data = {itemList:curResult,allCount:results.length};       
			        }
			        res.send(httpResult);
			        conn.release();
				})
			}
			catch(e){
				httpResult.code=-2;
				httpResult.data=e;
				res.send(httpResult);
			}
		}
	})	
}