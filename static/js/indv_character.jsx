function Hello(){
    return (
        <h1>This is a page for a single character</h1>
    );
}


console.log(Hello);
ReactDOM.render(<Hello />, document.getElementById("character"));