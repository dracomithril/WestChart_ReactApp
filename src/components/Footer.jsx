/**
 * Created by Gryzli on 12.02.2017.
 */
import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (<footer className="footer">
                    <span >{'site created by '}<a
                        href="https://github.com/dracomithril" target="_newtab">{"dracomithril "}</a>
                        repo on
                        <a href="https://github.com/dracomithril/WestChart_ReactApp" target="_newtab">
                            {" github"}
                            <i className="fa fa-github" aria-hidden="true"/>
                        </a> {' v' + process.env.npm_package_version + ' © Copyright 2017'}</span><br/>
            <span>{'Any questions? '}<a
                href="mailto:dracomithril@gmail.com?subject=[WCSChartAdmin]">contact me</a></span>
        </footer>);
    }
}
Footer.propTypes = {};