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
                <button type="button" className="create_acct" style={{background: 'none', border: 'none'}}>Forgot User Name?</button>
                <button type="button" className="create_acct" style={{background: 'none', border: 'none'}}>Forgot Password?</button>
            </div><br/>
            <div className="d-flex justify-content-center userStatusForm">
                <p style={{margin: "0em"}}>{props.prompt.introText}</p>
                <button type="button" onClick={props.changeText} className="create_acct" style={{background: 'none', border: 'none'}}>{props.prompt.buttonText}</button>
            </div><br/>
            <div className="d-flex justify-content-center">
                <button className="btn btn-outline-primary" id={props.prompt.status} type="" onClick={props.getFormInputs}>{props.prompt.status}</button>
            </div>
        </React.Fragment>

    );
}

function UserStatus(){
    const initalText = {buttonText: "Create an account.", introText: "New to CP?", status: "Login", currentform: ExistUserForm()}
    const initialInputs = {formType: null, user_name: null, user_password: null, valPassword: null, fname: null, lname: null, email: null}
    const [prompt, getText] = React.useState(initalText)
    const [formInputs, setInputs] = React.useState("empty")

    function changeText(evt){
        evt.preventDefault();
        if (prompt.introText == "New to CP?"){
            getText({...prompt, buttonText: "Log in!", introText: "Already have an account?", status: "Create Account", currentform: NewUserForm()});
        }
        else{
            getText({...prompt, buttonText: "Create an account.", introText: "New to CP?", status: "Log in", currentform: ExistUserForm()});
        }
    }

    function getFormInputs(evt){
        evt.preventDefault();
        const currentFormType = evt.target.id;
        if (currentFormType == "Login"){
            const userName = document.getElementById("user_name").value;
            const userPassword = document.getElementById("password").value;
            setInputs({...initialInputs, formType: "existingUser", user_name: userName, user_password: userPassword});
            console.log(`after serInputs ${formInputs}`);
            // setInputs(formInputs["formType"]="existingUser", formInputs["user_name"]=userName, formInputs["user_password"]=userPassword);

        }
        else if (currentFormType == "Create Account"){
            const userName = document.getElementById("user_name").value;
            const userPassword = document.getElementById("password").value;
            const valPassword = document.getElementById("password2").value;
            const fName = document.getElementById("fname").value;
            const lName = document.getElementById("lname").value;
            const Email = document.getElementById("email").value;
            setInputs(
                formInputs["formType"]="newUser", formInputs["user_name"]=userName, formInputs["user_password"]=userPassword,
                formInputs["valPassword"]=valPassword, formInputs["fname"]=fName, formInputs["lname"]=lName, 
                formInputs["email"]=Email
            );
        }
    }

    // React.useEffect(()=>{
    //     fetch('/handle_login',{
    //         method: 'POST',
    //         body: JSON.stringify(formInputs),
    //         headers: {'Content-Type': 'applicaton/json',}
    //     })
    //     .then((response)=>response.json())
    //     .then((responseJSON)=>responseJSON.message)
    // }, [formInputs]);

    return(
        <form action="/handle_login" method="POST">
            {prompt.currentform}
            <UserRedir changeText={changeText} prompt={prompt} getFormInputs={getFormInputs}/>
        </form>
    );
}

ReactDOM.render(<UserStatus />, document.getElementById("login"));