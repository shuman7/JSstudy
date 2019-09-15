$(function(){
    var dataURL = 'https://api.instagram.com/v1/users/self/media/recent'; //変数dataURLにインスタapiを代入
    var photoData; //わからん

    var getData = function(url) { //引数にurlを要求する関数getDataを定義
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: {
                access_token: '',
                count: 12
            }
        })
        .done(function(data){ //データの読み取りが出来た場合に走る処理
            photoData = data;
            
            $(photoData.data).each(function(){

                var caption = ''; //captionに空白を代入。なぜ空白を代入しているか?captionが書かれていない時に空白を返すようにするため
                if(this.caption){ //this.captionプロパティに何らかの値が存在すればtrue,なければfalse。thisはdataプロパティの配列の各項目を指している
                    caption = this.caption.text;//captionのテキストを代入
                }

                $('#gallery').append( //galleryに挿入。何を?↓
                    $('<div class="img_block"></div>')//<div class="img_block"></div>これを。さらに<div class="img_block"></div>に以下を挿入↓
                    .append(
                        $('<a></a>')//これを<div class="img_block"></div>に代入
                        .attr('href', this.link) //<a></a>のhrefにはthisのlinkを
                        .attr('target', '_blank') //targetには_blankを
                        .append(//<a></a>に以下を挿入
                            $('<img>').attr('src', this.images.low_resolution.url)//imgのsrcにlow_resolution.urlを使って、低解像度の画像のurlを挿入している
                        )
                    )
                    .append(
                        $('<p class="caption"></p>').text(caption + '♡' + this.likes.count)//<div class="img_block"></div>に<p class="caption"></p>を挿入する。<p class="caption"></p>にはcaption♡ハート数が挿入される。
                    )
                );
            });
            if($('#pagination').children().length === 0){
                $('#pagination').append(
                    $('<a class="next"></a>').attr('href', '#').text('もっと見る').on('click', function(e){
                        e.preventDefault();
                        if(photoData.pagination.next_url){
                            getData(photoData.pagination.next_url);
                        }
                    })
                );
            }

            if(!photoData.pagination.next_url){
                $('.next').remove();
            }
        })
        .fail(function(){
            $('#gallery').text(textStatus);
        })
    }

    getData(dataURL);
});