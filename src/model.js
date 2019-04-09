import { select } from 'easy-peasy';

const model = {
  questions: {
    byId: {
      1: {
        id: 1,
        type: 'checkbox',
        display: 'What type of job do you need the plumber to do ?',
        answers: [
          { id: 1, display: 'Repair' },
          { id: 2, display: 'Instalation' }
        ]
      },
      2: {
        id: 2,
        type: 'textarea',
        display: 'Where do you live?'
      },
      3: {
        id: 3,
        type: 'radio',
        display: 'Do you mind if we call you by phone?',
        answers: [
          { id: 3, display: 'Yes', linkId: 1},
          { id: 4, display: 'No'}
        ]
      },
      4: {
        id: 4,
        type: 'radio',
        display: 'When do you want the job to be done?',
        answers: [
          { id: 5, display: 'As soon as possible'},
          { id: 6, display: 'Whenever'},
          { id: 7, display: 'Specific date', type: 'datepicker'}
        ]
      },
      5: {
        id: 5,
        type: 'textarea',
        display: 'What is your phone number?'
      },
      6: {
        id: 6,
        type: 'textarea',
        display: 'When\'s the best time to call?'
      }
    },
    getById: select(state => id => state.byId[id])
  },
  nodes: {
    byId: {
      1: { elementType: 'question', elementId: 1, branchId: 1 },
      2: { elementType: 'question', elementId: 2, branchId: 1 },
      3: { elementType: 'question', elementId: 3, branchId: 1 },
      4: { elementType: 'question', elementId: 4, branchId: 1 },
      5: { elementType: 'question', elementId: 5, branchId: 2 },
      6: { elementType: 'question', elementId: 6, branchId: 2 }
    },
    getById: select(state => id => state.byId[id]),
  },
  branches: {
    byId: {
      1: { id: 1, nodeIds: [1, 2, 3, 4] },
      2: { id: 1, nodeIds: [5, 6] }
    },
    ids: [1, 2],
    getById: select(state => id => state.byId[id]),
    getBranchIndex: select(state => branchId => state.ids.findIndex(id => id === branchId))
  },
  links: {
    byId: {
      1: { id: 1, source: 3, target: 5 },
      2: { id: 2, source: 6, target: 4 }
    },
    ids: [1, 2],
    getById: select(state => id => state.byId[id]),
    linksForNode: select(state => id => {
      return state.ids.map((linkId) => {
        const link = state.getById(linkId);
        if (link.source === id || link.target === id) return link;
        return null;
      }).filter(Boolean)
    })
  },
  linksForBranch: select(state => branchId => {
    return state.branches.getById(branchId).nodeIds.map((nodeId) => {
      return state.links.linksForNode(nodeId);
    }).flat();
  }),
  getNodeIndex: select(state => nodeId => {
    const branchId = state.nodes.getById(nodeId).branchId;
    const nodeIds = state.branches.getById(branchId).nodeIds;
    return nodeIds.findIndex(id => id === nodeId);
  }),
  getBranchOffset: select(state => branchId => {
    let offset = 0;
    const branch = state.branches.getById(branchId);
    const links = state.linksForBranch(branchId);
    const startLink = links.find(link => link.target === branch.nodeIds[0]);
    if (startLink) {
      offset = state.getNodeIndex(startLink.source);
    }
    return offset;
  })
};

export default model;
