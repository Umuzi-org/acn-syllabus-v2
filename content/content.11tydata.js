var path = require('path');

const getPermalink = ({page}) => `${path.dirname(page.filePathStem)}/`

module.exports = {
	eleventyComputed: {
		permalink: getPermalink,
        eleventyNavigation: (args)=> {
  
            page = args.page
            const permalink = getPermalink({page})
            parent = path.dirname(permalink) + '/';
            if (parent === "/content/")
                parent = "/"
            return {
                key: permalink,
                parent: parent,
                title: args.eleventyNavigation && args.eleventyNavigation.title || args.title 
                // excerpt: "Vertebrate animals of the class Mammalia."
        }}
	}
};
