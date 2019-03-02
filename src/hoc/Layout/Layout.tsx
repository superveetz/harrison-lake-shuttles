import React, { Component } from 'react';

import Aux from '../Auxillary/Auxillary';
import MainNavBar from '../../components/Navigation/MainNavBar/MainNavBar';
import Footer from '../../components/Navigation/Footer/Footer';

class Layout extends Component {
	render() {
		return (
			<Aux>
				<MainNavBar />

				<main>
					{this.props.children}
				</main>

				<Footer />
			</Aux>
		)
	}
}

export default Layout;