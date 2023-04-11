

function SearchFilter(){
}

function Display(props){
    return (
        <div className="row">
            <h1>This is the creation page</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="outfitName">Outfit name</label>
                    <input type="outfitName" className="form-control" id="outfitName" placeholder="Name of outfit"/>
                </div>
                <div className="form-group">
                    <SearchCharacterName />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

function SearchCharacterName(){
    const [characterName, setCharacterName] = React.useState({name: ""})
    const [options, setOptions] =  React.useState([])

    function filterFunction(){
        let input = document.getElementById("myInput").value;
        const searchInput = {name: input};
        setCharacterName(searchInput);
    }

    function dropDown(){
        let content = []
        for (let i = 0; i < options.length ; i++) {
            const retCharacter = options[i];
            content.push(<li>{retCharacter.name.full}</li>);
        }
        return content;
    }

    React.useEffect(() => {
        fetch('/find_character',{
            method: 'POST',
            body: JSON.stringify(characterName),
            headers:{'Content-Type': 'application/json'},
        })
        .then((response)=>response.json())
        .then((serverData)=>{
            setOptions(serverData.data.Page.characters);
            dropDown
        });
    }, [characterName]);


    return (
        <div className="dropdown">
            <div id="myDropdown" className="dropdown-content">
                <input type="text" placeholder="Search.." id="myInput" onKeyUp={filterFunction}/>
                <ul className="list-group">
                    {dropDown()}
                </ul>
            </div>
        </div>
    );
}

ReactDOM.render(<Display />, document.getElementById("create"));