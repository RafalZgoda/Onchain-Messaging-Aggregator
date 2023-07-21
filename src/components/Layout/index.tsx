import React, { Children } from "react";
import HeaderAction from "./Header";

const Layout = (props) => {
	const { children } = props;
	return (
		<>
			<HeaderAction links={[]} />
			{children}
		</>
	);
};

export default Layout;
