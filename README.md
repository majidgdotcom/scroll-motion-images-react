# Motion images with scroll - Project

This project implements a MotionImagesWithScroll component that dynamically displays images while scrolling through the page. It supports various customizations such as image size, distance between images, fullscreen options, and responsiveness. The project also includes a Home component that renders multiple MotionImagesWithScroll instances with different configurations.

## Features

- **Dynamic Image Loading:** Images are loaded and displayed as the user scrolls.
- **Responsive Layout:** The layout is responsive, adjusting based on the window size.
- **ustomization:** Props allow for controlling image folder, number of images, scroll distance, and image size.
- **Full-Screen Support:** Option to display images in full-screen mode.

## Project Structure

- **Home.tsx:** Renders the MotionImagesWithScroll components with different configurations.
- **MotionImagesWithScroll.tsx:** The main component responsible for rendering images based on the user’s scroll position.
- **IMotionImagesWithScroll.ts:** Interface definition for the props passed to MotionImagesWithScroll.
- **home.css:** Custom styles for the components, including background colors, scrollbars, and responsive design.

## Installation

1.	Clone the repository:

2.	Navigate to the project directory:

	```
	cd scroll-motion-images-react

3.	Install the dependencies:

	```
	npm install

4.	Start the development server:

	```
	npm start

5.	Open http://localhost:3000 to view it in the browser.


## Usage

1.	**Folder Structure for Images:** Place your images in the public folder, organized in subfolders. For example:

        public/
        ├── majidTemplate/
        │   ├── 0.jpg
        │   ├── 1.jpg
        │   └── ...
        └── mickyTemplate/
            ├── 0.jpg
            ├── 1.jpg
            └── ...

2.	**Home Component:** The Home component demonstrates how to use the MotionImagesWithScroll component. It renders two sets of images with different configurations:

3.	**MotionImagesWithScroll Component:** This component displays images based on scroll position and provides customization options like fullscreen, width size, and distance between images.

## Props for MotionImagesWithScroll

| **Prop Name**  | **Type**               | **Description**                                                    |
|----------------|------------------------|--------------------------------------------------------------------|
| `id`           | `string`               | Unique identifier for the image set.                               |
| `folder`       | `string`               | Folder name where images are stored.                               |
| `length`       | `number`               | Total number of images in the folder.                              |
| `distance`     | `number`               | Distance between images in pixels.                                 |
| `fileFormat`   | `string`               | File format for the images (e.g., `.jpg`, `.png`).                 |
| `backColor`    | `string` (optional)    | Background color for the component.                                |
| `fullScreen`   | `boolean` (optional)   | Whether to display images in fullscreen mode.                      |
| `widthSize`    | `object` (optional)    | Object specifying image width before and after 768px.              |
| `scrollY`      | `number`               | Current scroll position, passed from the parent.                   |
| `windowSize`   | `object`               | Current window size (width and height), passed from the parent.    |
