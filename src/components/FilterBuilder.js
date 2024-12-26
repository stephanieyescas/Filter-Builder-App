import React, { useState } from 'react';
import './FilterBuilder.css';

const initialModulesData = [
  { id: '1', name: 'rb', content: 'rb', type: 'attribute' },
  { id: '2', name: 'drb', content: 'drb', type: 'attribute' },
  { id: '3', name: 'galactic_latitude', content: 'galactic_latitude', type: 'attribute' },
  { id: '4', name: 'jd', content: 'jd', type: 'attribute' },
  { id: '5', name: 'jdstarthist', content: 'jdstarthist', type: 'attribute' },
  { id: '6', name: 'AND', content: ' && ', type: 'operator' },
  { id: '7', name: 'OR', content: ' || ', type: 'operator' },
  { id: '8', name: '<', content: '<', type: 'comparator' },
  { id: '9', name: '<=', content: '<=', type: 'comparator' },
  { id: '10', name: '==', content: '==', type: 'comparator' },
  { id: '11', name: '>', content: '>', type: 'comparator' },
  { id: '12', name: '>=', content: '>=', type: 'comparator' },
  { id: '13', name: '!=', content: '!=', type: 'comparator' },
  { id: '14', name: 'Number', content: 'Number', type: 'input' },
];

const sampleDocuments = [
  { rb: 0.5, drb: 0.2, galactic_latitude: 5, jd: 2460318.5, jdstarthist: 2460314.5 },
  { rb: 0.5, drb: 0.99, galactic_latitude: -5, jd: 2460318.5, jdstarthist: 2460314.5 },
  { rb: 0.5, drb: 0.99, galactic_latitude: 30, jd: 2460318.5, jdstarthist: 2460300.5 },
  { rb: 0.9, drb: 0.8, galactic_latitude: 30, jd: 2460318.5, jdstarthist: 2460314.5 },
];

const FilterBuilder = () => {
  const [workspace, setWorkspace] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterExpression, setFilterExpression] = useState('');
  const [filterResults, setFilterResults] = useState([]);
  const [initialModules, setInitialModules] = useState(initialModulesData);

  const handleModuleClick = (module) => {
    const newModule = { ...module, id: `${module.id}-${Date.now()}` };
    setWorkspace([...workspace, newModule]);
    if (module.type === 'input') {
      setEditingIndex(workspace.length);
    }
  };

  const handleRemoveModule = (index) => {
    const newWorkspace = Array.from(workspace);
    newWorkspace.splice(index, 1);
    setWorkspace(newWorkspace);
  };

  const handleClearWorkspace = () => {
    setWorkspace([]);
  };

  const handleAddAttribute = () => {
    const attributeName = prompt('Enter the name of the new attribute:');
    const attributeContent = prompt('Define the new attribute in terms of other attributes:\n(ex. "jd - jdstarthist")');
    if (attributeName) {
      const newAttribute = {
        id: `attr-${Date.now()}`,
        name: attributeName,
        content: attributeContent,
        type: 'custom-attribute'
      };
      setInitialModules([...initialModules, newAttribute]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddInputModule = (index) => {
    const newWorkspace = Array.from(workspace);
    newWorkspace[index].content = inputValue;
    setWorkspace(newWorkspace);
    setInputValue('');
    setEditingIndex(null);
  };

  const handleModuleDoubleClick = (index) => {
    handleRemoveModule(index);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleAddInputModule(index);
    }
  };

  const handleCreateFilter = () => {
    const filterGroup = {
      id: `filter-group-${Date.now()}`,
      type: 'filter-group',
      content: [
        { id: `placeholder-1-${Date.now()}`, content: 'Attribute/Number', type: 'placeholder' },
        { id: `placeholder-2-${Date.now()}`, content: 'Comparator', type: 'placeholder' },
        { id: `placeholder-3-${Date.now()}`, content: 'Attribute/Number', type: 'placeholder' },
      ],
    };
    setWorkspace([...workspace, filterGroup]);
  };

  const handleDragStart = (e, module, index) => {
    e.dataTransfer.setData('module', JSON.stringify(module));
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData('module'));
    const draggedIndex = e.dataTransfer.getData('index');
    const newWorkspace = Array.from(workspace);
    newWorkspace.splice(draggedIndex, 1);
    newWorkspace.splice(index, 0, module);
    setWorkspace(newWorkspace);
  };

  const handleDropOnFilter = (e, filterIndex, groupIndex) => {
    e.preventDefault();
    const module = JSON.parse(e.dataTransfer.getData('module'));
    const draggedIndex = e.dataTransfer.getData('index');
    const newWorkspace = Array.from(workspace);
    newWorkspace[groupIndex].content[filterIndex] = module;
    if (draggedIndex !== undefined && draggedIndex < workspace.length) {
      newWorkspace.splice(draggedIndex, 1);
    }
    setWorkspace(newWorkspace);
  };

  const convertWorkspaceToFilterFunction = () => {
    const buildExpressions = (modules) => {
      let expressions = [];
      modules.forEach((module) => {
        if (module.type === 'filter-group') {
          const groupExpression = buildExpressions(module.content);
          expressions.push(`(${groupExpression.join(' ')})`);
        } else if (module.type === 'operator') {
            expressions.push(module.content);
        } else {
          let expression = '';
          if (module.type === 'attribute') {
            expression += `doc.${module.content} `;
          } else if (module.type === 'comparator') {
            expression += `${module.content} `;
          } else if (module.type === 'input') {
            expression += `${module.content} `;
            } else if (module.type === 'custom-attribute') {
              const parsedContent = module.content.split(/(\s+|[+\-*/])/).map(part => {
                return initialModulesData.some(mod => mod.name === part.trim()) ? `doc.${part.trim()}` : part;
              }).join(' ');
              expression += `(${parsedContent}) `;
            }
          expressions.push(expression.trim());
        }
      });
      console.log(expressions);
      return expressions;
    };

    const filterFunction = (doc) => {
      const expressions = buildExpressions(workspace);
      const combinedExpression = expressions.join(' ');
      try {
        return eval(combinedExpression);
      } catch (error) {
        console.error('Error evaluating filter expression:', error);
        alert('Invalid filter expression. Please check your filter and try again.');
        setFilterResults([{ error: 'Invalid filter expression. Please check your filter and try again.' }]);
        return false;
      }
    };
    return filterFunction;
  };

  const handleRunFilter = () => {
    const filterFunction = convertWorkspaceToFilterFunction();
    const results = sampleDocuments.filter(filterFunction);
    setFilterResults(results);
  };

  const handleClearResults = () => {
    setFilterResults([]);
  };

  return (
    <div className="filter-builder">
      <div className="module-palette">
        <div className="attributes-operators">
          <h3>Attributes</h3>
          {initialModules.filter(module => module.type === 'attribute').map((module) => (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module)}
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </div>
          ))}
          <h3>Operators</h3>
          {initialModules.filter(module => module.type === 'operator').map((module) => (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module)}
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </div>
          ))}
        </div>
        <div className="comparators-input">
          <h3>Comparators</h3>
          {initialModules.filter(module => module.type === 'comparator').map((module) => (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module)}
              onClick={() => handleModuleClick(module)}
            >
              {module.content}
            </div>
          ))}
          <h3>Inputs</h3>
          {initialModules.filter(module => module.type === 'input').map((module) => (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module)}
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </div>
          ))}
          <h3>Custom Attributes</h3>
          {initialModules.filter(module => module.type === 'custom-attribute').map((module) => (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module)}
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </div>
          ))}
        </div>
      </div>
      <div className="graph-workspace-container">
        <div className="graph-workspace">
        {workspace.map((module, index) => (
          module.type === 'filter-group' ? (
            <div key={module.id} className="filter-group"
            draggable>
              {module.content.map((filter, idx) => (
                <div
                  key={filter.id}
                  className={`module filter ${idx === 1 ? 'middle' : ''}`}
                  onDragStart={(e) => handleDragStart(e, module, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnFilter(e, idx, index)}
                  onDoubleClick={() => handleModuleDoubleClick(index)}
                >
                  {filter.content}
                </div>
              ))}
              <div className="line left-line"></div>
              <div className="line right-line"></div>
            </div>
          ) : (
            <div
              key={module.id}
              className="module"
              draggable
              onDragStart={(e) => handleDragStart(e, module, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDoubleClick={() => handleModuleDoubleClick(index)}
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  placeholder="Enter value"
                />
              ) : (
                module.type === 'attribute' || module.type === 'custom-attribute' ? module.name : module.content
              )}
            </div>
          )
        ))}
        </div>
        <div className="button-container">
          <button className="create-filter-button" onClick={handleCreateFilter}>Create Filter</button>
          <button className="add-attribute-button" onClick={handleAddAttribute}>Add Attribute</button>
          <button className="clear-button" onClick={handleClearWorkspace}>Clear Workspace</button>
          <button className="run-button" onClick={handleRunFilter}>Run</button>
          <button className="clear-results-button" onClick={handleClearResults}>Clear Results</button>
        </div>
        {filterExpression}
        {filterResults.length > 0 ? (
          <div className="filter-results">
            <h3>Filter Results:</h3>
            <pre>{JSON.stringify(filterResults, null, 2)}</pre>
          </div>
        ) : (
          <div className="filter-results">
            <h3>Filter Results:</h3>
            <p>No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBuilder;
