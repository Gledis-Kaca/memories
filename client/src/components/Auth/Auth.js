 import React, { useState } from 'react';
 import { Avatar, Button, Paper, Grid, Typography, Container, TextField, Icon } from '@material-ui/core';
 import { GoogleLogin,GoogleOAuthProvider } from '@react-oauth/google';
 import { useDispatch } from 'react-redux';
 import jwt_decode from "jwt-decode";
 import { useNavigate } from "react-router-dom";

 import IconSvg from './icon';
 import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
 import useStyles from './styles';
 import Input from './Input';
 import { signin, signup } from '../../actions/auth';

 const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

 const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [ isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState(initialState);

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isSignup){
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const googleSuccess = async (res) => {
        let decoded = jwt_decode(res.credential);
        const result = decoded;
        const token = res?.clientId;
        try {
            dispatch({type: 'AUTH', data: { result, token }})

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const googleFailure = (error) => {
        console.log(error)
        console.log("Google Sign In was unsuccessful. Try again latter")
    };

    return (
       <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Lirst Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ?  'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleOAuthProvider width="100" clientId='783640082083-4ecc402gbibvc31q08nrfn18jatmalou.apps.googleusercontent.com'>
                    <GoogleLogin 
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<IconSvg />} variant="contained" >Google Sign In</Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    </GoogleOAuthProvider>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account Sign In' : "Dont have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
       </Container>
    );
 };
 
 export default Auth; 