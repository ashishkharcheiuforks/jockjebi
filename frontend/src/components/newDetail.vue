<template>
    <div id="wrapper">
        <div style="background-color:#fefefe;height:100vh;">
            <div style="padding-left:110px;padding-right:140px">
                <div style="display: flex;">
                    <img src="https://image.flaticon.com/icons/svg/149/149346.svg"
                         style="padding: 40px 20px 20px 20px;width:240px; height:320px;border-radius: 30px; ">
                    <span style="padding: 40px 20px 20px 20px">
                <div style="display: flex;">
                    <span style="padding-right:5px;font-size:25px;"><b>{{post.subject}}</b></span>
                    <star-rating :max="5"
                                 :star-size="13"
                                 :rounded-corners="true"
                                 :increment="0.1"
                                 :read-only="true"
                                 :show-rating="false"
                                 :rating="post.star"
                    ></star-rating>
                    <template v-if="post.isOwner && $store.state.access">
                    <button @click="$router.history.push('/updatejockbo/' + post.id)" class="modify-delete">수정</button>
                    <button @click="deletePost" class="modify-delete">삭제</button>
                    </template>
                </div>
                <div style="font-size:15px; margin-top: 15px;">{{post.universityTitle}}</div>
                <div style="font-size:15px;">{{post.year}}년도 {{post.semester}}학기</div>
                <div style="font-size:15px">{{post.category}} | {{post.professor}}</div>
                <br/>
                <!-- <div>조회수 {{post.views}} | 다운로드 {{post.downloads}}건</div> -->
                <div>정답 및 해설 {{haveAnswer}}</div>
                <br/>
                <div>{{post.publishedDate}}에 <b style="color:#6c60f5">{{post.username}}</b>가 업로드함</div>
                <br/>
                <div style="display: flex">
                    <div style="padding-right:10px;">
                        <a v-bind:href="post.file" @click.prevent="downloadJockbo(post.file)">
                        <button style="font-size:15px;color:white;background-color:#5f52ed;width:100px;height:40px;border-style:solid;border-radius: 10px;"><b>다운로드</b></button></a>
                    </div>
                    <!-- <div style="padding-right:10px;">
                        <button style="font-size:15px;color:#0729d4;background-color:#ffffff;width:100px;height:40px;border-style:solid;border-radius: 10px;"><b>추천하기</b></button>
                    </div> -->
                    <div>
                        <button style="font-size:15px;color:#0729d4;background-color:#ffffff;width:100px;height:40px;border-style:solid;border-radius: 10px;" @click="deterScrap" v-if="$store.state.access"><b>{{isScraped}}</b></button>
                    </div>
                </div>
            </span>
                </div>

                <div style="padding-left:20px">
                    <div style="padding-top:20px;padding-bottom:20px;color:#6c60f5;font-size:18px;"><b>업로더의 코멘트</b>
                    </div>

                    <div style="padding-bottom:30px;font-size:15px;">{{post.explain}}</div>


                    <div style="margin-left:-140px;width:2000px;height:10px;background-color: #fafafa;"></div>


                    <div style="padding-top:30px;">
                        <div style="font-size:18px; color:#6c60f5"><b>댓글</b></div>
                        <br/>
                        <div v-for="comment in comments" style="display: flex; justify-content: space-between; padding: 10px 10px 10px 10px;border-style:solid;width:690px;border-radius:10px;border-width:1px;border-color:#e4e4e4">
                            <div>
                            <div style="display: flex;">
                                <div style="padding-right:10px;"><b>{{comment.nickname}}</b></div>
                                <star-rating :max="5"
                                             :star-size="13"
                                             :rounded-corners="true"
                                             :fixed-points="3"
                                             :read-only="true"
                                             :show-rating="false"
                                             :rating="comment.star"
                                ></star-rating>
                            </div>
                            <div style="font-size:13px;">{{comment.content}}</div>
                            </div>
                            <button @click="deleteComment(comment)" class="modify-delete comment-delete" v-if="comment.isOwner">삭제</button>
                        </div>
                        
                        <div style="font-size:18px; padding-top:20px;color:#6c60f5"><b>의견 남기기</b></div>
                        <div style="display: flex;padding-top:10px;">
                            <div style="width:570px;display: flex;border-style:solid;border-color:#d6d6d6;border-radius:15px;border-width:1px;">
                                <div style="padding-left:10px;padding-right:20px;padding-top:10px;">
                                    <star-rating :max="5"
                                                :star-size="20"
                                                :rounded-corners="true"
                                                :show-rating="false"
                                                v-model="star"
                                    ></star-rating>
                                </div>
                                <div>
                            <textarea placeholder="비방성 댓글은 관리자에 의해 삭제될 수 있습니다." class="input-field" rows="4" cols="50"
                                      style="width:440px;" v-model="content">

                            </textarea>
                                </div>
                            </div>
                            <div style="padding-left:20px;">
                                <button style="font-size:15px;color:white;background-color:#5f52ed;width:100px;height:40px;border-style:solid;border-radius: 10px;" @click="postComment">
                                    <b>등록하기</b>
                                </button>
                            </div>
                        </div>
                        <!--                        <div style="font-size:18px; color:#6c60f5;padding-top:20px;"><b>이 사용자의 다른 족보</b></div>-->
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    import StarRating from 'vue-star-rating'

    export default {
        props: ['id'],
        data() {
            return {
                star: 0,
                content: '',
                post: {},
                comments: []
            }
        },
        computed: {
            haveAnswer() {
                return this.post.haveAnswer === true ? '있음' : '없음'
            },
            isScraped() {
                return this.post.isBookmarked === true ? '스크랩 취소하기' : '스크랩 하기'
            },
            deterScrap() {
                return this.post.isBookmarked === true ? this.unscrap : this.scrap
            },
        },
        components: {
            StarRating
        },
        methods: {
            async readPost() {
                try {
                    let response = await this.readPostResponse()
                    this.post = response.data
                }
                catch(error) {
                    alert('서버가 불안정합니다 잠시후에 시도하세요!')
                }
            },
            readPostResponse() {
                return axios({
                    method: 'get',
                    url: '/api/post/' + this.id,
                    headers: {
                        authorization: this.$store.state.access,
                    },
                })
            },
            async downloadJockbo (url) {
                if(this.$store.state.access) {
                    try {
                        await this.$store.dispatch('inspectToken')
                        axios.get(url, { responseType: 'blob' })
                        .then(({ data }) => {
                       
                            let blob = new Blob([data], { type: 'image/png' })
                            let link = document.createElement('a')
                            const filename = url.split("/")
                            link.href = window.URL.createObjectURL(blob)
                            link.download = filename[filename.length - 1]
                            link.click()
                        .catch(error => {
                            alert('서버가 불안정합니다 잠시후 다시 시도해주세요')
                        })
                        })
                    }
                    catch(error) {
                        alert(error)
                    }
                }
                else {
                    alert('로그인후에 이용해주세요!')
                }
            },
            async deletePost() {
                if (confirm('족보를 삭제하시겠습니까?')) {
                    try {
                        await this.$store.dispatch('inspectToken')
                        axios({
                            method: 'delete',
                            url: '/api/post/' + this.post.id,
                            headers: {
                                authorization: this.$store.state.access,
                            },
                        }).then((response) => {
                            alert('삭제 되었습니다!')
                            this.$router.history.push('/jockbolist?subject=')
                        })
                    }
                    catch(error) {
                        alert('세션이 만료되었습니다. 다시 로그인 해주세요')
                    }
                }
            },
            readComments() {
                axios({
                    method: 'get',
                    url: '/api/post/' + this.id + '/comment',
                    headers: {
                        authorization: this.$store.state.access,
                    },
                }).then((response) => {
                    this.comments = response.data
                })
            },
            async postComment() {
                if(this.$store.state.access) {
                    try {
                        await this.$store.dispatch('inspectToken')
                        axios({
                            method: 'post',
                            url: '/api/post/' + this.id + '/comment',
                            data: {
                                content: this.content,
                                star: this.star
                            },
                            headers: {
                                authorization: this.$store.state.access,
                            },
                        }).then((response) => {
                            this.readComments()
                        })
                        }
                    catch(error) {
                        alert(error)
                    }
                }
                else {
                    alert('로그인후 이용해주세요')
                }
            },
            async deleteComment(comment) {
                if (confirm('댓글을 삭제하시겠습니까?')) {
                    try {
                        await this.$store.dispatch('inspectToken')
                        axios({
                        method: 'delete',
                        url: '/api/comment/' + comment.id,
                        headers: {
                            authorization: this.$store.state.access,
                        },
                        }).then((response) => {
                            alert('삭제 되었습니다!')
                            comment.content = '삭제 되었습니다'
                            comment.isOwner = false
                        })
                    }
                    catch(error) {
                        alert(error)
                    }
                } 
            },
            async scrap() {
                try {
                    await this.$store.dispatch('inspectToken')
                    const post = this.post
                    axios({
                        method: 'post',
                        url: '/api/post/' + this.id + '/bookmark',
                        headers: {
                            authorization: this.$store.state.access,
                        },
                    }).then((response) => {
                        alert('스크랩 되었습니다!')
                        this.post = {...post, isBookmarked: true};
                    })
                }
                catch(error) {
                    alert(error)
                }
            },
            async unscrap() {
                try {
                    await this.$store.dispatch('inspectToken')
                    const post = this.post
                    axios({
                        method: 'delete',
                        url: '/api/post/' + this.id + '/bookmark',
                        headers: {
                            authorization: this.$store.state.access,
                        },
                    }).then((response) => {
                        alert('스크랩이 취소 되었습니다!')
                        this.post = {...post, isBookmarked: false};
                    })
                }
                catch(error) {
                    alert(error)
                }
            }
        },
        async mounted() {
            try {
                await this.$store.dispatch('inspectToken')
            }
            catch(error) {
                alert(error)
            }
            await this.readPost()
            this.readComments()
        }
    }

</script>

<style scoped>
    #wrapper {
        padding-top: 10px;
        width: 960px;
        margin: 0 auto;
        /*border-style:solid;*/
    }

    .input-field {
        padding-top: 10px;
        display: inline-block;
        outline: none;
        font-size: 17px;
        height: 40px;
        color: #212121;
    }

    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        font-size: 13px;
        padding-top: 5px;
        color: #d5d5d5;
        opacity: 1; /* Firefox */
    }

    .modify-delete {
        color: black;
        background-color: yellow;
        width: 50px;
        height: 30px;
        border-style: solid;
        border-radius: 10px;
        margin-left: 10px;
        font-weight: bold;
    }

    .modify-delete:nth-of-type(2), .comment-delete {
        background-color: pink;
    }
</style>
