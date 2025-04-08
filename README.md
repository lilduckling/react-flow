# React Flow Application

This project is a workflow editor built using [React Flow](https://reactflow.dev/). It allows users to create and manage workflows with custom nodes, edges, and dynamic interactions.

## Features

- **Custom Nodes**: Includes "Action Nodes," "If / Else Nodes," and "Branch Nodes."
- **Dynamic Node Management**: Add, edit, and delete nodes dynamically.
- **Branching Logic**: Add branches and "Else" nodes to "If / Else" nodes with customizable positions.
- **Interactive UI**: Drag-and-drop functionality for nodes and edges.
- **React Flow Integration**: Built on top of the React Flow library for seamless workflow management.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## How to Use

1. **Start the Application**:
   Run `npm start` to launch the application in development mode.

2. **Add Nodes**:
   - Right-click on an edge to open the edge menu.
   - Add "Action Nodes" or "If / Else Nodes" dynamically.

3. **Edit Nodes**:
   - Click on a node to open the edit modal.
   - Update the node's label or delete the node.

4. **Add Branches**:
   - Use the "If / Else" form to add branches or an "Else" node.
   - Branch nodes spawn dynamically between the rightmost branch node and the "Else" node.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **React Flow**: Library for creating interactive node-based workflows.
- **TypeScript**: Strongly typed programming language for better code quality.
- **CSS**: Styling for the application.

## Learn More

To learn more about React Flow, visit the [official documentation](https://reactflow.dev/).  
To learn React, check out the [React documentation](https://reactjs.org/).

---

## License

This project is licensed under the MIT License.
