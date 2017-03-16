/**
 * Created by 维 on 2017/3/15.
 */
function Music($music) {
    this.appendHtml($music);
    this.init($music);
    this.getMusic();
    this.bind();
}
Music.prototype = {
    constructor:"Music",
    appendHtml:function ($music) {
        var html = '<div class="icon-music">&#xe61f;</div>'
        +'<div class="main">'
            +'<audio src=""></audio>'
            +'<div class="board">'
                +'<img src="img/music_0003s_0000_Kanye.png" alt="">'
                +'<div class="content">'
                    +'<h3 class="singer"></h3>'
                    +'<h3 class="songName"></h3>'
                    +'<div class="loading"><img src="img/music_0001s_0000_slider.png" alt=""><img src="img/music_0001s_0002_loading.png" alt=""></div>'
                    +'<div class="btn">'
                        +'<div class="wrapper">'
                            +'<img class="pre" src="img/music_0002s_0000_Rewind.png" alt="">'
                            +'<img class="play-pause" src="img/music_0002s_0002_Play.png" pause-src="img/music_0002s_0003_Pause.png" play-src="img/music_0002s_0002_Play.png" alt="">'
                            +'<img class="next" src="img/music_0002s_0001_Fast-forward.png" alt="">'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>';
        // console.log($(html));
        $music.append($(html));
    },
    init:function ($music) {
        this.audio = $music.find("audio")[0];
        this.$singer = $music.find(".singer");
        this.$songName = $music.find(".songName");
        this.$playPause = $music.find(".play-pause");
        this.$next = $music.find(".next");
        this.$pre = $music.find(".pre");
        this.$load = $music.find(".loading>img").eq(0);
        this.$loadBar = $music.find(".loading>img").eq(1);
        this.$icon = $music.find(".icon-music");
        this.$player = $music.find(".main");

        this.canPlay = false;
        this.musicList = [];
        this.index = 0;
        this.latestIndex = 0;
        this.clock;
        this.interv;
        this.nthSong=0;
    },
    bind:function () {
        var self = this;
        this.$icon.on("click",function (){
                self.showHide(self.$player);
                self.animateRotate(self.$icon,180);
        });

        this.$playPause.on("click",function(){
            self.playPause();
        });

        this.$next.on("click",function(){
            if(self.clock){
                clearTimeout(self.clock);
            }
            self.clock = setTimeout(function(){
                self.canPlay = true;
                self.index+=1;
                if(self.index>=self.latestIndex){
                    self.getMusic();
                }else{
                    self.audio.setAttribute("src",self.musicList[self.index].url);
                    self.$singer.text(self.musicList[self.index].artist);
                    self.$songName.text(self.musicList[self.index].songName);
                    self.play();
                }
            },300);

        });

        self.$pre.on("click",function () {
            self.index -= 1;
            if(self.index<0) self.index = 0;
            self.audio.setAttribute("src",self.musicList[self.index].url);
            self.$singer.text(self.musicList[self.index].artist);
            self.$songName.text(self.musicList[self.index].songName);
            self.play();
        });

        $(this.audio).on({
            "loadstart":function () {

            },
            "playing":function () {
                self.interv= setInterval(function () {
                        var loadBarWidth = self.$loadBar.width()-18;
                        var musicDura = self.audio.duration;
                        var currentTime = self.audio.currentTime;

                        var left = currentTime/musicDura*loadBarWidth;
                        self.$load.animate({
                            left:left
                        },300,function () {
                        });
                },900);
            },
            "pause":function () {
                clearInterval(self.interv);
            },
            "ended":function () {
                clearInterval(self.interv);
            }
        })
    },
    getMusic:function () {
        var self =this;
        $.ajax({
            // url:"http://api.jirengu.com/fm/getSong.php?Billboard=public_tuijian_billboard",
            url:"src/json/music.json",
            method:"get",
            dataType:"json"
        }).done(function(ret){

            var curSong = {};
            self.audio.setAttribute("src",ret[self.nthSong].url);
            self.$singer.text(ret[self.nthSong].artist);
            self.$songName.text(ret[self.nthSong].tittle);

            curSong.url = ret[self.nthSong].url;
            curSong.singer = ret[self.nthSong].artist;
            curSong.songName = ret[self.nthSong].tittle;

            self.musicList.push(curSong);
            self.latestIndex = self.musicList.length;

            if(self.nthSong>=ret.length-1){
                self.nthSong = 0;
            }else{
                self.nthSong +=1;
            }

            if(self.canPlay){
                self.play();
            }

        });
    },
    play:function () {
        var pause = this.$playPause.attr("pause-src");
        this.audio.play();
        this.$playPause.attr("src",pause);
    },
    playPause:function () {
        var state = this.$playPause.attr("src");
        var play = this.$playPause.attr("play-src");
        var pause = this.$playPause.attr("pause-src");
        if(state === play){
            this.audio.play();
            this.$playPause.attr("src",pause);
        }else{
            this.audio.pause();
            this.$playPause.attr("src",play);
        }
    },
    showHide:function ($element) {
        var state = this.$player.css("display");
        if(state === "none"){
            $element.show(2000);
        }else{
            $element.hide(2000);
        }
    },
    animateRotate:function ($element,angle) {
        $({deg:0}).animate({deg:angle},{
            duration:800,
            easing:"swing",
            step:function (now) {
                $element.css({
                    transform:"rotate("+now+"deg)"
                });
            },
            complete:function () {
                $({deg:angle}).animate({deg:0},{
                    duration:800,
                    step:function (now) {
                        $element.css({
                            transform:"rotate("+now+"deg)"
                        });
                    }
                })
            }
        })
    }

};
