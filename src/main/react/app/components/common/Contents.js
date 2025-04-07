import mock from "../resources/mock";

import main_my from "./../resources/main_my.png"

import "rsuite/Container/styles/index.css";
import "rsuite/Content/styles/index.css";

import React from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { Button, Container, Content, Input, Table, Text } from 'rsuite';
import { Cell, Column, HeaderCell } from 'rsuite-table';

const Contents = () => {
	return (
		<Content>
			<Outlet />
			<Routes>
				<Route
					path="/"
					element={<img src={main_my} />}
				/>
				<Route
					path="/p"
					element={
						<Container>
							<Text>그래</Text>
						</Container>
					}
				/>
			</Routes>
		</Content>
	);
};

export default Contents;