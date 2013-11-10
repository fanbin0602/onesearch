/*
Plugin: jQuery ONEsearch
Version 1.0.0
Auther: Fan Bin
*/

(function($){
    
    var engines;
    
    $.ajax({
        async:false,
        url:"./json/engines.json",
        dataType:"json",
        success:function(data){
            engines = data;
        }
    });
    
    $.fn.onesearch = function(){
        
        //text input
        var $this = $(this);
        var $form = $("#"+$this.attr("form"));
        
        //init input style
        $this.css("font-size","20px");
        $this.css("line-height","20px");
        $this.css("padding","10px");
        $this.css("background-image","none");
        $this.css("background-repeat","no-repeat");
        $this.css("background-position","left");
        $this.css("background-size","100px 40px");
        
        //input content getter & setter
        function getInput(){
            return $this.val();
        }
        function setInput(content){
            $this.val(content);
        }
        
        //current using search engine
        var currEngine = null;
        //last content length
        var lastLen = 0;
        //user input key
        var key;
        
        //find search engine by content
        function findEngine(content){
            for(var i = 0; i < engines.length; i++){
                var engine = engines[i];
                for(var j = 0; j < engine.keywords.length; j++){
                    var keyword = engine.keywords[j];
                    if(keyword+' ' == content){
                        console.log("engine getted");
                        currEngine = engine;
                        key = keyword;
                        return;
                    }
                }
            }
        }
        
        //event
        $this.keyup(function(event){
            
            var code = event.which?event.which:event.keyCode;
            
            if(code==13) {//enter
                $form.submit();
            }
            
            if(code==32) {//space
                
                if(currEngine==null){
                    
                    findEngine(getInput().toLowerCase());
                    
                    if(currEngine!=null){
                        //add
                        $this.css("background-image","url("+currEngine.img+")").css("padding-left","100px");
                        setInput(getInput().substr(key.length+1));
                        $this.attr("name",currEngine.name);
                        $form.attr("action",currEngine.action);
                        $form.attr("ccept-charset",currEngine.charset);
                    }
                    
                }
                    
            } else if(code==8) {//backspace
                
                if(lastLen==0&&currEngine!=null){
                    //remove
                    $this.css("background-image","none").css("padding-left","10px");
                    $this.attr("name","");
                    $form.attr("action","");
                    currEngine = null;
                    setInput("");
                }
            }
            
            lastLen = getInput().length;
            
        });
        
        $form.submit(function(){
            
            if(currEngine==null){
                $form.attr("action","http://www.google.com.hk/search");
                $this.attr("name","q");
            } else if((currEngine.action==null||currEngine.action=="")&&currEngine.query!=""){
                var destination = currEngine.query.replace("{query}", getInput());
                window.open(destination);
                return false;
            }
            
            setInput(getInput().replace(/(^\s*)|(\s*$)/g, ""));
        })
        
        $info = $("#info");
        for(var i = 0; i < engines.length; i++){
            var engine = engines[i];
            $info.append("<p>输入“ "+engine.keywords[0]+"＋<em>空格</em>＋关键词 ”，使用“"+engine.engine+"”搜索。</p>");
        }
    }
    
})(jQuery);