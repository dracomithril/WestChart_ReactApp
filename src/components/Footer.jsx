/**
 * Created by Gryzli on 12.02.2017.
 */
import React from 'react';

export default class Footer extends React.Component {
    render() {
        let leftPadding = {paddingLeft:3};
        return (<footer className="footer">
                    <span>{'site created by '}
                        <a
                            href="https://github.com/dracomithril" target="_newtab">{"dracomithril "}
                        </a>
                        repo on
                        <a href="https://github.com/dracomithril/WestChart_ReactApp" target="_newtab">
                            <i style={leftPadding} className="fa fa-github" aria-hidden="true"/><br/>
                        </a> {' v' + process.env.npm_package_version}<i style={leftPadding} className="fa fa-copyright">{" Copyright 2017"}</i>
                        </span>
            <br/>
            <span>{'Any questions? '}<a
                href="mailto:dracomithril@gmail.com?subject=[WCSChartAdmin]"><i style={leftPadding} className="fa fa-envelope"/>contact me</a>
            </span>
            <br/>
            <a href={"/api/fb/policy"}><i style={leftPadding} className="fa fa-facebook-square"/>{" Policy"}</a>
        </footer>);
    }
}
Footer.propTypes = {};