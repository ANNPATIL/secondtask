import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class allblogs extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categories: '',
			blogs: '',
			fblogs:'',
			filtered: false,
			title: '',
			body: '',
			category_id:'',
			blogId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

		this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentDidMount = () => {
		const authToken = localStorage.getItem('AuthToken');
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `${authToken}`
		  }
		axios
			.get('/blogs/categories',{headers:headers})
			.then((response) => {
				console.log(response);
				this.setState({
					categories: response.data,
				});
				axios
			.get('/blogs/allposts',{headers:headers})
			.then((response) => {
				console.log(response);
				this.setState({
					blogs: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
			})
			.catch((err) => {
				console.log(err);
			});
		
	};

	deleteTodoHandler(data) {
		//const authToken = localStorage.getItem('AuthToken');
		//axios.defaults.headers.common = { Authorization: `${authToken}` };
		let blogId = data.blog.id;
		axios
			.delete(`blogs/post/${blogId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		this.setState({
			title: data.blog.title,
			body: data.blog.body,
			category_id: data.blog.category.id,
			blogId: data.blog.id,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			title: data.blog.title,
			body: data.blog.body,
			category_id: data.blog.category.id,
			viewOpen: true
		});
	}

	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				blogId: '',
				title: '',
				category_id: '',
				body: '',
				buttonType: '',
				open: true
			});
		};
		const handleSearch = (event) => {
			let value = event.target.value.toLowerCase();
			let result = [];
console.log(value);
if(value != ''){
result = this.state.blogs.filter((data) => {
return data.title.search(value) != -1;
});
this.setState({
	fblogs:result,
	filtered: true,
}
);
}
else{
	this.setState({
		fblogs:'',
		filtered: false,
	}
	);	
}
		}
		const handleSubmit = (event) => {
			
			event.preventDefault();
			const authToken = localStorage.getItem('AuthToken');
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `${authToken}`
		  }
			const userBlog = {
				title: this.state.title,
				body: this.state.body
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/blogs/post/${this.state.blogId}/${this.state.category_id}`,
					method: 'put',
					data: userBlog,
					headers:headers
				};
			} else {
				options = {
					url: `/blogs/post/${this.state.category_id}`,
					method: 'post',
					data: userBlog,
					headers:headers
				};
			}
			console.log(userBlog);
			//const authToken = localStorage.getItem('AuthToken');
			//axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<div style={{ marginTop: '5', marginBottom: '3%' }}>
<label>Search:</label>
<input type="text" onChange={(event) =>handleSearch(event)} />
</div>
					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Blog"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Blog' : 'Create a new Blog'}
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
							<Grid container spacing={2}>
							<Grid item xs={12}>
									<Select
										variant="outlined"
										labelId="demo-simple-select-label"
										required
										fullWidth
										id="categoryDetails"
										label="Select Category"
										name="category_id"
										onChange={this.handleChange}
										value={this.state.category_id}
									>
										{
											this.state.categories? this.state.categories.map((category,index) => {
												return <MenuItem key={index} value={category.id}>{category.category}</MenuItem>
											}):null
										}
										</Select>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="todoTitle"
										label="Todo Title"
										name="title"
										autoComplete="todoTitle"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="blogDetails"
										label="Blog Details"
										name="body"
										autoComplete="blogDetails"
										multiline
										minRows={25}
										maxRows={25}
										helperText={errors.body}
										error={errors.body ? true : false}
										onChange={this.handleChange}
										value={this.state.body}
									/>
								</Grid>
								
							</Grid>
						</form>
					</Dialog>

					<Grid container spacing={2}>
	
						{
							this.state.filtered?
						this.state.fblogs.map((blog,id) => (
							<Grid item xs={12} sm={6} key={id}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{blog.title}
										</Typography>
										<Typography variant="h5" component="h2">
											Category: {blog.category && blog.category.category }
										</Typography>
										
										<Typography variant="body2" component="p">
											{`${blog.body.substring(0, 65)}`}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" onClick={() => this.handleViewOpen({ blog })}>
											{' '}
											View{' '}
										</Button>
										
									</CardActions>
								</Card>
							</Grid>
						)):this.state.blogs.map((blog,id) => (
							<Grid item xs={12} sm={6} key={id}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{blog.title}
										</Typography>
										<Typography variant="h5" component="h2">
											Category: {blog.category && blog.category.category }
										</Typography>
										
										<Typography variant="body2" component="p">
											{`${blog.body.substring(0, 65)}`}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" onClick={() => this.handleViewOpen({ blog })}>
											{' '}
											View{' '}
										</Button>
										
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>

					<Dialog
						onClose={handleViewClose}
						aria-labelledby="customized-dialog-title"
						open={viewOpen}
						fullWidth
						classes={{ paperFullWidth: classes.dialogeStyle }}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
							{this.state.title}
						</DialogTitle>
						<DialogContent dividers>
							<TextField
								fullWidth
								id="blogDetails"
								name="body"
								multiline
								readonly
								rows={1}
								rowsMax={25}
								value={this.state.body}
								InputProps={{
									disableUnderline: true
								}}
							/>
						</DialogContent>
					</Dialog>
				</main>
			);
		}
	}
}

export default withStyles(styles)(allblogs);
