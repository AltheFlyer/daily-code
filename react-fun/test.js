class List extends React.Component {
    render() {
        return (
            <div class="list">
                <ul>
                    {this.props.name}
                    <li>A</li>  
                    <li>B</li> 
                    <li>C</li>   
                </ul>

                <button>Add one</button>
            </div>
        );
    }
}

ReactDOM.render(
    <List/>,
    document.getElementById('root')
);