import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';

import { getRequest } from '../../../../utils/httpClient';

import './style';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '尚妆用户',
            userImage: 'http://file.showjoy.com/images/12/12883d98a25d4b55aed6d2813cf40eac.jpg.120x120.jpg'
        };
    };

    componentWillMount() {
        let _self = this;
        let tempState = Object.assign({}, _self.state);
        getRequest({
            context: _self,
            url: 'http://monitor.showjoy.net/getUserInfo',
            response: (err, res) => {
                let responseResult = JSON.parse(res.text);
                let userInfo = responseResult.data;
                if (userInfo) {
                    tempState.userImage = userInfo.image;
                    tempState.userName = userInfo.nick;
                    _self.setState(tempState);
                }
            }
        });
    };

    render() {
        return (
            <div className="header">
                <Link to="/">
                    <div className="logo"><Icon type="area-chart" />Monitor</div>
                </Link>
                <img id="image" src={this.state.userImage}></img>
                <span id="name">{this.state.userName}</span>
            </div>
        );
    }
}

export default Header;