# CODING STANDARDS

The best coding practices and standards for react web development. These are not hard and fast rules but common practices to write clean and consistent code. Most of them hold good for all frontend frameworks and not really specific to React.

## GENERAL BEST PRACTICES

- Folderize Your Components (all related files in one folder).

  - This means that strictly no - “putting all the code in the same folder, naming them `*.jsx`”

- A good design pattern to follow would also be the “atomic design pattern”. I will leave a link to a medium article that has more info about the same.

  - [Atomic Design Pattern](https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97).

- Naming Conventions:

  - All react components should follow a camel case with the first letter being capital like so, with the extension of `.jsx`. This clearly indicates that the file contains react related code.

    ```js
    /** File name => ReactComponent.jsx */
    <ReactComponent>
    ```

  - This is also enforced in react directly.
  - Any file that is not a `React Component` must use the `.js` extension and must begin with a smaller case letter like so `someHelper.js`. Clearly idicating that this file does not contiain React related code.

- Use the DRY principle (Don't repeat yourself). If it is possible to write a piece of code one and reuse that, you should always opt for reusability.
- Create multiple files instead of writing a big file. As a general guiding rule, it is good to keep the number of lines in any given file to 300 or lesser. This will force you to divide the code into small reusable functional units - A added bonus is that this will help in testing.
- Use a linter to make your code easier to review. Follow strict linting rules. This in turn helps you write clean, consistent code.
- Remove unused and commented out code. This makes the code harder to read and debug.

## HTML

- Please close all the HTML tags appropriately

```jsx
/** This is not allowed. This component does not have any children. You can use the JSX shorthand for closing the tag */
<SomeComponent></SomeComponent>

/** Components without children */
<SomeComponent />

/** Components with children */
<SomeComponent>
  <SomeChildComponent />
</SomeComponent>
```

## CSS

- Avoid Inline CSS as and when possible (a CSS class should be created when there are more than 2 CSS attributes).
- Avoid using the CSS `!important`. This is very bad practice, this will enforce the browser to use this style value and makes degbugging very difficult.

```css
.text {
  display: flex;
  height: 30px !important;
}
```

- Use a CSS pre processor like SASS or SCSS. They provied a host of functionalities which are very useful.
- Avoide setting individual CSS properties, use the shorthands instead. This is better for performance.

```css
/* Avoid */
.class {
  border-color: #fff;
  border-width: 1px;
  border-style: solid;
}

/* Use */
.class {
  border: 1px solid #fff;
}
```

- Each component should maintain its own styles.
- Global styles should be defined and placed at the root of the project.
- Use CSS variables to define color palet for the application. This makes it easier to access the color palet and later change them if needed.

```css
/* Definition */
:root {
  /** Background Colors */
  --body-background: #1d1d1d;
  --container-background: #292929;
  --primary-logo-background: #000000;
  --menu-background: #181818;
}

/* Access */
.class {
  color: var(--body-background);
}
```

## JAVASCRIPT

- Using a type checker / prop checker if you are using JSX. Usage of type checker or props checker enables you to avoid common pitfalls of writing code in react / javascript. There are several options such as:

  - [Flow](https://flow.org/en/docs/react/)
  - [PropTypes](https://www.npmjs.com/package/prop-types)

- Depending on the size of the project, use `Typescript`.

- Avoid using the JS spread syntax too much. This makes the code unreadable.

```jsx
/** Avoid */
const obj = { a: '', b: '', c: '' }
<SomeComponent text={...obj} />

/***********************************************************************/

/** Use */
const text = { a: '', b: '', c: '' }
<SomeComponent text={text} />
```

- Avoid passing callback functions in the props to a component in order to set state in the parent or do some calculation. This leads to very bad code that is hard to debug.

```jsx
/** Component is the child Component of some component <Parent /> */
<Component
  callBackFunction={(a) => {
    setState({ ...a }); // <= This fucntion is setting state inside the parent component from within the Component
  }}
/>
```

- Avoid using inline styles. Always use CSS classes instead. This leads to better code seperation and cleaner code.

```jsx
/** Aviod */
<div
  style={{
    maxHeight: reorder ? "200px" : "40px", // <= Instead of doing this you can use CSS-IN-JS libraries
    transition: "0.3s linear all",
    overflow: reorder ? "auto" : "hidden",
    backgroundColor: "white",
    border: "1px solid lightgrey",
  }}
/>

/***********************************************************************/

/** Use */
<div className="someclass" />
```

```css
/** CSS */
.someclass {
  maxHeight: "200px"
  transition: "0.3s linear all",
  overflow: "auto",
  backgroundColor: "white",
  border: "1px solid lightgrey",
}
```

- If there is a requirement in the project of being able to dynamically change the style of some components in JS then you can use CSS-In-JS libraries (Listed below).

  - [Styles Components](https://styled-components.com/)
  - [JSS](https://cssinjs.org/)
  - [Emotion](https://emotion.sh/docs/introduction)

- CSS-IN-JS libraries offer a lot of advantages compared to just trying to dynamically change the CSS by adding it in-line in the JS code (_this should be carefully considered based on the requirements for the project, because they can add unnecessary overhead to the project as well_)

  - Automatic critical CSS (_this means your users load the least amount of code necessary_)
  - No class name bugs
  - Easier deletion of CSS
  - Simple dynamic styling
  - Painless maintenance
  - Automatic vendor prefixing

- Use default props for all components. This is specially true if you are not using a Typechecker.

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: "Stranger",
};

// Renders "Hello, Stranger":
const root = ReactDOM.createRoot(document.getElementById("example"));
root.render(<Greeting />);
```

- Use `prop-type` to keep check of the props that are required and their types

```jsx
import PropTypes from "prop-types";

class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string,
};
```

- Functions should have a single `return` statement

```js
/** Dont */
const someFunction () => {
  if (something) {
    const value = 'Hello';

    return value;
  } else {
    const value = 'Bye';

    return value;
  }
}

/***********************************************************************/

/** Do Instead */
const someFunction () => {
  let value = 'Bye';

  if (something) {
    value = 'Hello';
  }

  return value;
}
```

- Check for the negative case in your function instead of making an `if-else` case. This makes for better readability.

```js
function something() {
  /** Check for the negative case first */
  if (valueDoesNotExist) return;

  /** Execute only if valueExists */
}
```

- No declaring state without using both the `setter` and `getter` functions.

```js
/** Unacceptable */
const [value, setValue] = useState("test"); // <= The "value" variable is not being read anywhere.

if (something) {
  setValue("test_two"); // <= Though the state is not being read anywhere it is being set
}

/***********************************************************************/

/** Both value and setValue must be used*/
const [value, setValue] = useState("test");

<SomeComponent value={value} />;

if (something) {
  setValue("test_two");
}
```

- As far as possible try to limit the export of named variables in a file. The larger the application gets and the functionality gets with the file, the higher the size of the bundle will be. There will be a lot of unused code in the bundle making it heavy and as a result making the application slow.

```js
/** one.js */
import something from "something";

export const one = () => "test_one";
export const two = () => "test_two";

/** two.js */
import { one } from "./one"; // <= This will import the whole file "one.js" into the bundle though we only use one function
```

- No infinite looping with file imports. Two seperate files cannot import each other.

```js
/** one.js */
import two from "./two";

/** two.js */
import one from "./one";
```

- No directly accessing deeply nested properties. This make the code very hard to debug and read. You can use a loop or any of the array prototype methods to access these objects. You can refer to them [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

```js
/** Do not do this */
const one = test.obj[0].two[1].three.four[0][0]; // <= Anyone reading this line of code will not understand what is happening
```

## STATE MAINTENANCE

- Components should maintain and update their own states. Meaning that child components are not allowed to set the state of the parent and vice-versa
- You can use React Context API to avoid prop forwarding.
- If the project is too big, then a shared application is required. In this case using Redux and Redux Sagas are very helpful.

## NETWORK

- Separate all your service calls into a separate file. If it’s a big project try to split the services into multiple files OR you use Redux Sagas to build your network layer.
- Redux Sagas makes the application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, easy to test, and better at handling failures.
