import { logout } from "../../utils/jwt.js";
import { displayPopup } from "../../utils/popup.js";
import { BarGraph } from "../graphs/barGraph.js";
import { LineGraph } from "../graphs/lineGraph.js";
import { PieChart } from "../graphs/pieChart.js";
import { SpiderChart } from "../graphs/spiderChart.js";
import { USER_PROFILE_QUERY } from "../../api/queries.js";
import { fetchGraphQLData } from "../../api/client.js";



//handle profile view
export async function renderProfileView() {
    const app = document.getElementById('app');

    //remove existing content
    const existingContent = document.querySelector(
        '.signin-container, .sign-in-container, .profile-container, .about-container, .sidebar, .profile-layout'
    );
    if (existingContent) {
        existingContent.remove();
    }

  const profileContent = document.createElement('div');
  profileContent.className = 'profile-container';

  // Show loading indicator initially
  profileContent.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading your profile data...</p>
    </div>
  `;

  app.appendChild(profileContent);

  setTimeout(() => {
    profileContent.innerHTML = `
      <div class="top-welcome">
        <h1>| Welcome <span id="userName"></span></h1>
      </div>

      <div class="profile-card-section">
        <div class="profile-card">
          <div class="profile-card-header">
            <div class="profile-avatar">
              <span id="avatarInitial">U</span>
            </div>
            <div class="profile-card-info">
              <h2 id="fullName">Loading...</h2>
              <p class="username">@<span id="username">Loading...</span></p>
            </div>
          </div>
          <div class="profile-card-details">
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value" id="email">Loading...</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Campus</span>
              <span class="detail-value" id="campus">Loading...</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Level</span>
              <span class="detail-value" id="level">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div id="spider-chart" class="profile-section">
          <h3>Best Skills</h3>
          <div class="spider-chart-container">
            <div id="spiderChart" class="chart-container"></div>
          </div>
        </div>

        <div id="audit-stats" class="profile-section">
          <h3>Audit Statistics</h3>
          <div class="audit-stats">
            <p><strong>Total Upvotes:</strong> <span id="totalUpvotes">Loading...</span></p>
            <p><strong>Total Downvotes:</strong> <span id="totalDownvotes">Loading...</span></p>
            <p><strong>Audit Ratio:</strong> <span id="auditRatio">Loading...</span></p>
          </div>
          <div id="auditRatioChart" class="chart-container"></div>
        </div>
        
        <div id="xp-stats" class="profile-section">
          <h3>XP Statistics</h3>
          <div class="xp-stats">
            <p><strong>Total XP:</strong> <span id="totalXp">Loading...</span></p>
          </div>
          <div id="xpGraph" class="chart-container"></div>
        </div>

        <div id="project-stats" class="profile-section">
          <h3>Project Statistics</h3>
          <div class="project-stats">
            <p><strong>Completed Projects:</strong> <span id="completedProjects">Loading...</span></p>
            <p><strong>Current Projects:</strong> <span id="currentProjects">Loading...</span></p>
          </div>
          <div id="projectGraph" class="chart-container"></div>
        </div>
      </div>

      <div id="completed-projects" class="profile-section">
        <h3>Completed Projects</h3>
        <div class="completed-projects-grid" id="completedProjectsGrid">
          <div class="projects-list">
            <p>Loading completed projects...</p>
          </div>
        </div>
      </div>

      <div id="current-projects" class="profile-section">
        <h3>Current Projects</h3>
        <div class="current-projects-grid" id="currentProjectsGrid">
          <div class="projects-list">
            <p>Loading current projects...</p>
          </div>
        </div>
      </div>

      <div id="skills" class="profile-section">
        <h3>Skills</h3>
        <div class="skills-container">
          <div id="skillsGraph" class="chart-container"></div>
        </div>
      </div>
    `;

// Load profile data
    loadProfileData();
  }, 1000);
}
async function loadProfileData() {
  try {
    const data = await fetchGraphQLData(USER_PROFILE_QUERY);

    if (!data || !data.data || !data.data.user) {
      displayPopup('No user data found', false);
      return;
    }

    const userData = data.data.user[0];

    // Update welcome banner with username
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) {
      userNameSpan.textContent = userData.firstName || 'User';
    }

    // Update profile card
    const avatarInitial = document.getElementById('avatarInitial');
    if (avatarInitial && userData.firstName) {
      avatarInitial.textContent = userData.firstName.charAt(0).toUpperCase();
    }

    updateElementText(
      'fullName',
      `${userData.firstName || ''} ${userData.lastName || ''}`
    );
    updateElementText('username', userData.login || 'N/A');
    updateElementText('email', userData.email || 'N/A');
    updateElementText('campus', userData.campus || 'N/A');
    updateElementText('level', userData.level_amount?.[0]?.amount || 'N/A');

    // Update Contribution Activity
    // const contributionGraphContainer = document.getElementById('contributionGraph');
    // if (contributionGraphContainer) {
    //   const xpData =
    //     userData.xp?.map((x) => ({
    //       createdAt: x.createdAt,
    //       amount: x.amount || 0,
    //     })) || [];

    //   if (xpData.length > 0) {
    //     // Calculate total contributions (count of XP entries)
    //     const totalContributions = xpData.length;
    //     updateElementText('totalContributions', totalContributions.toString());

    //     // Sort data by date
    //     xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));



        // contributionGraphContainer.innerHTML = '';
        // const contributionGraphInstance = new ContributionGraph(xpData, {
        //   squareSize: 16,    // Increased from 12 to 16
        //   squareGap: 2,      // Reduced from 3 to 2 for tighter grid
        //   padding: 35,       // Increased from 25 to 35
        //   color: "#3e3eff",
        // });
        // const svgElement = contributionGraphInstance.render();
        
        // Create scrollable container that stays centered
    //     const scrollContainer = document.createElement('div');
    //     scrollContainer.className = 'contribution-scroll-container';
    //     scrollContainer.appendChild(svgElement);
        
    //     contributionGraphContainer.appendChild(scrollContainer);
    //   } else {
    //     updateElementText('totalContributions', '0');
    //     contributionGraphContainer.innerHTML = '<p>No contribution data available</p>';
    //   }
    // }

    // Update Spider-Chart for best skills
    const spiderChart = document.getElementById('spiderChart');
    if (spiderChart) {
      if (userData.skills && userData.skills.length > 0) {
        const skillsData = userData.skills.map((skill) => {
          // Format skill type (remove "skill_" prefix and capitalize)
          const skillName =
            skill.type.replace('skill_', '').charAt(0).toUpperCase() +
            skill.type.replace('skill_', '').slice(1);

          return {
            status: skillName,
            count: skill.amount,
          };
        });

        // Sort skills by amount in descending order and take top 7
        skillsData.sort((a, b) => b.count - a.count);
        const topSkillsData = skillsData.slice(0, 8);

        spiderChart.innerHTML = '';
        const spiderChartInstance = new SpiderChart(topSkillsData, {
          width: 400,
          height: 400,
          maxValue: 100,
          colors: ['#3e3eff'],
        });
        spiderChart.appendChild(spiderChartInstance.render());
      } else {
        spiderChart.innerHTML = '<p>No skills data available</p>';
      }
    }

    // Update audit statistics
    const totalUp = userData.totalUp || 0;
    const totalDown = userData.totalDown || 0;
    const auditRatio = userData.auditRatio || 'N/A';

    updateElementText('totalUpvotes', totalUp.toString());
    updateElementText('totalDownvotes', totalDown.toString());
    updateElementText('auditRatio', typeof auditRatio === 'number' ? auditRatio.toFixed(2) : auditRatio.toString());

    // Create and render the pie chart for audit ratio
    const auditRatioChart = document.getElementById('auditRatioChart');
    if (auditRatioChart) {
      const auditRatioData = [
        { label: 'Upvotes', value: totalUp },
        { label: 'Downvotes', value: totalDown },
      ];

      const pieChart = new PieChart(auditRatioData, {
        width: 600,
        height: 300,
        colors: ['#008805ff', '#940d03ff'], // Green for upvotes, red for downvotes
        showLabels: true,
        showPercentages: true,
        showLegend: true,
      });

      auditRatioChart.innerHTML = '';
      auditRatioChart.appendChild(pieChart.render());
    }

    // Update XP statistics
    const totalXp = userData.totalXp?.aggregate?.sum?.amount || 0;
    updateElementText('totalXp', totalXp.toLocaleString());

    // Create XP progress graph
    const xpGraph = document.getElementById('xpGraph');
    if (xpGraph) {
      const xpData =
        userData.xp?.map((x) => ({
          createdAt: x.createdAt,
          amount: x.amount || 0,
        })) || [];

      if (xpData.length > 0) {
        // Sort data by date
        xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Calculate cumulative XP
        let cumulativeXP = 0;
        const cumulativeXpData = xpData.map((item) => {
          cumulativeXP += item.amount;
          return {
            createdAt: item.createdAt,
            amount: cumulativeXP,
          };
        });

        xpGraph.innerHTML = ''; // Clear any existing content
        const lineGraph = new LineGraph(cumulativeXpData, {
          width: 600,
          height: 300,
          padding: 40,
        });
        const svgElement = lineGraph.render();
        xpGraph.appendChild(svgElement);
      } else {
        xpGraph.innerHTML = '<p>No XP data available</p>';
      }
    }

    // Update project statistics
    const completedProjects = userData.completed_projects?.length || 0;
    const currentProjects = userData.current_projects?.length || 0;
    updateElementText('completedProjects', completedProjects.toString());
    updateElementText('currentProjects', currentProjects.toString());

    // Create project status graph
    const projectGraph = document.getElementById('projectGraph');
    if (projectGraph) {
      const projectData = [
        { status: 'Completed', count: completedProjects || 0 },
        { status: 'Current', count: currentProjects || 0 },
      ];

      if (completedProjects > 0 || currentProjects > 0) {
        projectGraph.innerHTML = ''; // Clear any existing content
        const barGraph = new BarGraph(projectData, {
          width: 600,
          height: 300,
          padding: 40,
          colors: ['#3e3eff', '#4caf50'],
        });
        const svgElement = barGraph.render();
        projectGraph.appendChild(svgElement);
      } else {
        projectGraph.innerHTML = '<p>No project data available</p>';
      }
    }

    // Update completed projects section
    const completedProjectsGrid = document.getElementById(
      'completedProjectsGrid'
    );
    if (completedProjectsGrid) {
      if (
        userData.completed_projects &&
        userData.completed_projects.length > 0
      ) {
        completedProjectsGrid.innerHTML = '';

        userData.completed_projects.forEach((project) => {
          const projectPath = project.group.path;
          const projectName = projectPath.split('/').pop(); // Get the last part of the path

          const projectCard = document.createElement('div');
          projectCard.className = 'project-card';
          projectCard.innerHTML = `
            <p>${formatProjectName(projectName)}</p>
          `;

          completedProjectsGrid.appendChild(projectCard);
        });
      } else {
        completedProjectsGrid.innerHTML = '<p>No completed projects found.</p>';
      }
    }

    // Update current projects section
    const currentProjectsGrid = document.getElementById('currentProjectsGrid');
    if (currentProjectsGrid) {
      if (userData.current_projects && userData.current_projects.length > 0) {
        currentProjectsGrid.innerHTML = '';

        userData.current_projects.forEach((project) => {
          const projectPath = project.group.path;
          const projectName = projectPath.split('/').pop(); // Get the last part of the path

          const projectCard = document.createElement('div');
          projectCard.className = 'project-card current-project';
          projectCard.innerHTML = `
            <p>${formatProjectName(projectName)}</p>
          `;

          currentProjectsGrid.appendChild(projectCard);
        });
      } else {
        currentProjectsGrid.innerHTML = '<p>No current projects found.</p>';
      }
    }

    // Update skills section
    const skillsGraph = document.getElementById('skillsGraph');
    if (skillsGraph) {
      if (userData.skills && userData.skills.length > 0) {
        const skillsData = userData.skills.map((skill) => {
          // Format skill type (remove "skill_" prefix and capitalize)
          const skillName =
            skill.type.replace('skill_', '').charAt(0).toUpperCase() +
            skill.type.replace('skill_', '').slice(1);

          return {
            status: skillName,
            count: skill.amount,
          };
        });

        // Sort skills by amount in descending order
        skillsData.sort((a, b) => b.count - a.count);

        // Use the enhanced BarGraph with options
        const barGraph = new BarGraph(skillsData, {
          width: 800,
          maxValue: 100,
          gridLines: [0, 50, 100],
          colors: ['#3e3eff', '#4b7bec', '#3867d6', '#4b6584'],
          height: 400,
          barSpacing: 20,
          padding: 60,
        });

        skillsGraph.innerHTML = '';
        skillsGraph.appendChild(barGraph.render());
      } else {
        skillsGraph.innerHTML = '<p>No skills data available</p>';
      }
    }
  } catch (error) {
    displayPopup(error.message || 'Error loading profile data', false);
    console.error('Error loading profile data:', error);
  }
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

function formatProjectName(name) {
  // Replace hyphens and underscores with spaces
  let formattedName = name.replace(/[-_]/g, ' ');

  // Capitalize each word
  formattedName = formattedName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formattedName;
}
