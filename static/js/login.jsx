function NewUserForm(){
    return (
        <React.Fragment>
        <br/>
        <h1 className="d-flex justify-content-center">Join today!</h1>
        <br/>
        <div className="row">
            <div className="form-group col">
                <label htmlFor="fname">First Name</label>
                <input type="text" className="form-control" placeholder="First Name" id="fname" name="fname"/>
            </div>
            <div className="form-group col">
                <label htmlFor="lname">Last Name</label>
                <input type="text" className="form-control" placeholder="Last Name" id="lname" name="lname"/>
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="email" htmlform="email">Email:</label>
            <input type="text" className="form-control" placeholder="Email" id="email" name="email"/>
        </div>

        <div className="form-group">
            <label htmlFor="user_name" htmlform="user_name">Username:</label>
            <input type="text" className="form-control" placeholder="Username" id="user_name" name="user_name"/>
        </div>

        <div className="row">
            <div className="form-group col">
                <label htmlFor="password">Password</label>
                <input type="text" className="form-control" placeholder="Password" id="password" name="password"/>
            </div>
            <div className="form-group col">
                <label htmlFor="password2">Password</label>
                <input type="text" className="form-control" placeholder="Retype Password" id="password2" name="password"/>
            </div>
        </div>
        <br/>        
        </React.Fragment>

    );
}

function ExistUserForm(){
    return(
        <React.Fragment>
        <br/>
        <h1 className="d-flex justify-content-center">Welcome Back!</h1>
        <br/>
        <div className="row">
            <div className="form-group col">
                <label htmlFor="user_name">Username/Email</label>
                <input type="text" className="form-control" placeholder="Username/Email" id="user_name" name="user_name"/>
            </div>
            <div className="form-group col">
                <label htmlFor="password">Password</label>
                <input type="text" className="form-control" placeholder="Password" id="password" name="password"/>
            </div>
        </div>
        <br/> 
        </React.Fragment>

    );
}

function UserRedir(props){

    return(
        <React.Fragment>
            
            <div className="d-flex justify-content-center">
                <button type="button" /*onClick={setForm}*/ className="create_acct" style={{background: 'none', border: 'none'}}>Forgot User Name?</button>
                <button type="button" /*onClick={setForm}*/ className="create_acct" style={{background: 'none', border: 'none'}}>Forgot Password?</button>
            </div>
            <div className="d-flex justify-content-center">
                <p style={{margin: "0em"}}>{props.prompt.introText}</p>
                <button type="button" onClick={props.changeText} className="create_acct" style={{background: 'none', border: 'none'}}>{props.prompt.buttonText}</button>
            </div>
            <div className="d-flex justify-content-center">
                <button onChange={props.changeForm} className="btn btn-outline-primary" id="userStatus" type="button" /*onChange={props.changeText}*/ /*onClick={props.setStatus}*/>{props.prompt.status}</button>
            </div>
        </React.Fragment>

    );
}

function UserStatus(){
    const [userForm, getForm] = React.useState(ExistUserForm)
    
    const initalText ={buttonText: "Create an account.", introText: "New to CP?", status: "Login", currentform: ExistUserForm()}
    const [prompt, getText] = React.useState(initalText)

    function changeText(evt){
        evt.preventDefault();
        if (prompt.introText == "New to CP?"){
            getText({...prompt, buttonText: "Log in!", introText: "Already have an account?", status: "Create Account", currentform: NewUserForm()});
        }
        else{
            getText({...prompt, buttonText: "Create an account.", introText: "New to CP?", status: "Log in", currentform: ExistUserForm()});
        }
    }
    


    return(
        <form>
            {prompt.currentform}
            <UserRedir changeText={changeText} prompt={prompt} />
        </form>
    );
}

ReactDOM.render(<UserStatus />, document.getElementById("login"));