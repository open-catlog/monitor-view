import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';


import './style';

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <Link to="/">
                    <div className="logo"><Icon type="area-chart" />Monitor</div>
                </Link>
            </div>
        );
    }
}

export default Header;