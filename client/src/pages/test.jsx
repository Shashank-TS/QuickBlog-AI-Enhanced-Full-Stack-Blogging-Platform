import axios from "axios";

const Test = () => {

  const fetchBlogData = async () => {
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/blog/update/684809dfa718a2443df90e8b`,
        {
          category: "Technology",
          description:
            '<h1><strong style="color: rgb(37, 37, 37);">Learning New Tech to Boost Your Software Career</strong></h1><p><span style="color: rgb(41, 41, 41);">In tech, staying still means falling behind. Here’s how learning new technologies can fast-track your software career:</span></p><h2><strong style="color: rgb(37, 37, 37);">1. Stay Relevant</strong></h2><p><span style="color: rgb(41, 41, 41);">Tech evolves fast. Learning modern tools, frameworks, or languages keeps you valuable to employers and clients.</span></p><h2><strong style="color: rgb(37, 37, 37);">2. Increase Opportunities</strong></h2><p><span style="color: rgb(41, 41, 41);">New skills open doors—whether it’s switching to a better role, freelancing, or launching your own product.</span></p><h2><strong style="color: rgb(37, 37, 37);">3. Grow Your Confidence</strong></h2><p><span style="color: rgb(41, 41, 41);">Tackling new tech boosts problem-solving skills and helps you adapt quickly in real-world projects.</span></p><h2><strong style="color: rgb(37, 37, 37);">4. Stand Out</strong></h2><p><span style="color: rgb(41, 41, 41);">Knowing in-demand skills (like TypeScript, DevOps, AI/ML, or cloud platforms) makes your resume and GitHub shine.</span></p><h2><strong style="color: rgb(37, 37, 37);">5. How to Learn Smart</strong></h2><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(0, 0, 0);">Pick tech that aligns with your goals</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(0, 0, 0);">Build real projects</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(0, 0, 0);">Join communities and open source</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgb(0, 0, 0);">Stay consistent, not perfect</span></li></ol>',
          image:
            "https://ik.imagekit.io/shashu7892/1749551579945-tech_3MGMOw-0J.webp",
          published: true,
          subTitle: "Learning New Tech to Boost Your Software Career",
          title: "Learning new technology to boost your career in software",
        },
        {
          withCredentials: true,
        }
      );
      const blogData = await res.data;

      console.log("blog fetched successfully ", blogData);
    } catch (error) {
      console.error("error fetching blog: ", error);
      toast.error("An error occurred while fetching the blog.");
    }
  };

  return (
    <div>
      <button onClick={fetchBlogData}>set</button>
    </div>
  );
};

export default Test;
