import React from "react";
import Swiper from "swiper";
import {getCarousel,getNewAlbum} from "../../api/recommend";
import {CODE_SUCCESS} from "../../api/config";
import "./recommend.styl";
import "swiper/dist/css/swiper.css";
import * as AlbumModel from "../../model/album";
import Scroll from "../../common/scroll/Scroll";
import Loading from "../../common/loading/Loading";
import LazyLoad, { forceCheck } from "react-lazyload";
import { Route } from "react-router-dom";
import Album from "../album/Album"

/**
 * 推荐页Class
 * 
 * @class Recommend
 * @extends {React.Component}
 */
class Recommend extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            loading: true,
            sliderList: [],
            newAlbums: [],
            refreshScroll: false
        }
    }
    // 第一次渲染dom完成时触发
    async componentDidMount() {
        await this.getSlider();
        await this.getAlbum();
    }
    /**
     * 获取专辑
     * 
     * @memberof Recommend
     */
    async getAlbum() {
        try {
            let res = await getNewAlbum();
            if(res) {
                if(res.code === CODE_SUCCESS) {
                    // 根据发布时间降序排序
                    let albumList = res.albumlib.data.list;
                    albumList.sort((a,b) => {
                        return new Date(b.public_time).getTime() - new Date(a.public_time).getTime();
                    })
                    this.setState({
                        loading: false,
                        newAlbums: albumList
                    },() => {
                        this.setState({refreshScroll:true});
                    })
                }
            }
        } catch (error) {
            
        }
    }
    /**
     * 轮播图
     * 
     * @memberof Recommend
     */
    async getSlider() {
        try {
            let res = await getCarousel();
            if(res) {
                if(res.code === CODE_SUCCESS) {
                    this.setState({
                        sliderList: res.data.slider
                    },() => {
                        if(!this.sliderSwiper) {
                            this.sliderSwiper = new Swiper(".slider-container",{
                                loop: true,
                                autoplay: 3000,
                                autoplayDisableOnInteraction: false,
                                pagination: '.swiper-pagination'
                            })
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error.msg);
        }
    }
    /**
     * 点击图片链接
     * 
     * @param {any} linkUrl 
     * @returns 闭包函数
     * @memberof Recommend
     */
    toLink(linkUrl) {
        return () => {
            window.location.href = linkUrl;
        }
    }
    /**
     *点击专辑跳转 
     * 
     * @param {any} url 
     * @returns 
     * @memberof Recommend
     */
    toAlbumDetail(url) {
        /*scroll组件会派发一个点击事件，不能使用链接跳转*/
        return () => {
            this.props.history.push({
                pathname: url
            });
        }        
    }
    render() {
        let {match} = this.props;
        // 创建专辑实例
        let albums = this.state.newAlbums.map(item => {
            let album = AlbumModel.createAlbumByList(item);
            return (
                <div className="album-wrapper" key={album.mId} 
                    onClick={this.toAlbumDetail(`${match.url + '/' + album.mId}`)}
                >
                    <div className="left" >
                        <LazyLoad>
                            <img src={album.img} width="100%" height="100%" alt={album.name}/>
                        </LazyLoad>
                    </div>
                    <div className="right">
                        <div className="album-name">
                            {album.name}
                        </div>
                        <div className="singer-name">
                            {album.singer}
                        </div>
                        <div className="public—time">
                            {album.publicTime}
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className="music-recommend" >
                <Scroll refresh={this.state.refreshScroll} 
                    onScroll={(e) => {
                            /*检查懒加载组件是否出现在视图中，如果出现就加载组件*/
                            forceCheck();
                        } 
                    }>
                    <div>
                        <div className="slider-container">
                            <div className="swiper-wrapper" >
                                {
                                    this.state.sliderList.map(slider => {
                                        return (
                                            <div className="swiper-slide" key={slider.id}>
                                                <a className="slider-nav" onClick={this.toLink(slider.linkUrl)} >
                                                    <img src={slider.picUrl} alt="推荐" width="100%" height="100%"/>
                                                </a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="swiper-pagination" ></div>
                        </div>
                        <div className="album-container">
                            <h1 className="title">最新专辑</h1>
                            <div className="album-list">
                                {albums}
                            </div>
                        </div> 
                    </div>
                </Scroll>
                <Loading title="正在加载..." show={this.state.loading}/>
                <Route path={`${match.url + '/:id'}`} component={Album} />
            </div>
        );
    }
}

export default Recommend