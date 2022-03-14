import React, { Component } from 'react';
import axios from 'axios';
import Account from '../components/account';
import Blog from '../components/blog';
import Category from '../components/category';
import Allblogs from './allblogs';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import NotesIcon from '@material-ui/icons/Notes';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createBrowserHistory } from 'history';
import { Container } from '@material-ui/core';

const drawerWidth = 240;
const history = createBrowserHistory();
const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

class Home extends Component {
	state = {
		render: false,
		cpage:false,
		myblog: false
	};
	
  logoutHandler = (event) => {
	  console.log("Logout");
		localStorage.removeItem('AuthToken');
		history.push('/login');
		window.location.reload();
	};
  loadAccountPage = (event) => {
		this.setState({ render: true });
		this.setState({ cpage: false});
	};

  loadBlogPage = (event) => {
		this.setState({ render: false });
		this.setState({ cpage: false });
		this.setState({ myblog: true });
	};
	loadAllBlogPage = (event) => {
		this.setState({ render: false });
		this.setState({ cpage: false });
		this.setState({ myblog: false });
	};
	loadCategoryPage = (event) => {
		this.setState({ cpage: true });
		this.setState({ render: false });
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			email:'',
      phoneNumber:'',
			uiLoading: false,
			
		};
	}

	componentDidMount = () => {
		const authToken = localStorage.getItem('AuthToken');
    console.log("token:"+ authToken);
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `${authToken}`
	  }
		
		axios
			.get('/secured/claim',{headers:headers})
			.then((response) => {
				console.log("Resp:"+response);
				if(response.data != ''){
					console.log("user");
				this.setState({
					firstName: response.data.firstName,
					lastName: response.data.lastName,
					email: response.data.email,
					phoneNumber: response.phone,
					uiLoading: false,
				});
			}
			else{
				console.log("no user");
				this.setState({
					firstName: '',
					lastName: '',
					email: '',
					phoneNumber: '',
					uiLoading: false,
				});
				
			}
			})
			.catch((error) => {
				console.log(error);
				
        history.push('/login');
		window.location.reload();
			});
		
			
	};

	render() {
		const { classes } = this.props;
		if (this.state.uiLoading === true) {
			// return (
				// <div className={classes.root}>
				// 	{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				// </div>
			// );
		} else {
			return (
				<div style={{ 
					backgroundImage: `url("https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60")`,
					height: "100vh",
					width: "100wh",
					backgroundposition: "center",
					backgroundrepeat: "no-repeat",
					backgroundSize: "cover"
				 }}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								Blog
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>
            <ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon>
									{' '}
									<PeopleIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="My Profile" />
							</ListItem>
							<ListItem button key="Category" onClick={this.loadCategoryPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Categories" />
							</ListItem>
			  <ListItem button key="MyBlogs" onClick={this.loadBlogPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="My Blogs" />
							</ListItem>
							<ListItem button key="AllBlogs" onClick={this.loadAllBlogPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Other Blogs" />
							</ListItem>
              
							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>
          <div>{this.state.cpage ? <Category /> :this.state.render ? <Account /> : this.state.myblog? <Blog/>: <Allblogs/>}</div>
				</div>
				</div>
			);
			
		}
	}
}

export default withStyles(styles)(Home);
