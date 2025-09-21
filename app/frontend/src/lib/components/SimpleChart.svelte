<script>
  export let type = 'bar'; // 'bar', 'line', 'pie', 'doughnut'
  export let data = [];
  export let title = '';
  export let height = 300;
  export let showLegend = true;
  export let colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  let chartContainer;

  function formatValue(value) {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  }

  function getColor(index) {
    return colors[index % colors.length];
  }

  $: maxValue = Math.max(...data.map(d => d.value || 0));
  $: totalValue = data.reduce((sum, d) => sum + (d.value || 0), 0);
</script>

<div class="chart-container" style="height: {height}px;">
  {#if title}
    <h4 class="text-lg font-medium text-gray-900 mb-4">{title}</h4>
  {/if}

  {#if type === 'bar'}
    <div class="bar-chart" bind:this={chartContainer}>
      {#each data as item, index}
        <div class="bar-item">
          <div class="bar-label">{item.label}</div>
          <div class="bar-container">
            <div
              class="bar"
              style="height: {((item.value || 0) / maxValue) * (height - 80)}px; background-color: {getColor(index)}"
              title="{item.label}: {formatValue(item.value)}"
            ></div>
          </div>
          <div class="bar-value">{formatValue(item.value)}</div>
        </div>
      {/each}
    </div>

  {:else if type === 'line'}
    <div class="line-chart" style="height: {height - 40}px;">
      <svg width="100%" height="100%" viewBox="0 0 400 300">
        {#if data.length > 1}
          <polyline
            fill="none"
            stroke={colors[0]}
            stroke-width="2"
            points={data.map((d, i) => `${(i / (data.length - 1)) * 380 + 10},${290 - ((d.value || 0) / maxValue) * 280}`).join(' ')}
          />
          {#each data as item, index}
            <circle
              cx={(index / (data.length - 1)) * 380 + 10}
              cy={290 - ((item.value || 0) / maxValue) * 280}
              r="4"
              fill={colors[0]}
              title="{item.label}: {formatValue(item.value)}"
            />
          {/each}
        {/if}
      </svg>
      <div class="line-labels">
        {#each data as item}
          <span class="line-label">{item.label}</span>
        {/each}
      </div>
    </div>

  {:else if type === 'pie' || type === 'doughnut'}
    <div class="pie-chart">
      <svg width="100%" height="{height - 40}" viewBox="0 0 300 300">
        {#each data as item, index}
          {@const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value || 0), 0) / totalValue * 360}
          {@const endAngle = startAngle + ((item.value || 0) / totalValue * 360)}
          {@const largeArcFlag = (item.value || 0) / totalValue > 0.5 ? 1 : 0}
          {@const x1 = 150 + 100 * Math.cos((startAngle - 90) * Math.PI / 180)}
          {@const y1 = 150 + 100 * Math.sin((startAngle - 90) * Math.PI / 180)}
          {@const x2 = 150 + 100 * Math.cos((endAngle - 90) * Math.PI / 180)}
          {@const y2 = 150 + 100 * Math.sin((endAngle - 90) * Math.PI / 180)}
          {@const innerRadius = type === 'doughnut' ? 50 : 0}
          {@const x3 = 150 + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180)}
          {@const y3 = 150 + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)}
          {@const x4 = 150 + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180)}
          {@const y4 = 150 + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)}

          <path
            d="M 150 150 L {x1} {y1} A 100 100 0 {largeArcFlag} 1 {x2} {y2} {type === 'doughnut' ? `L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}` : ''} Z"
            fill={getColor(index)}
            title="{item.label}: {formatValue(item.value)} ({((item.value || 0) / totalValue * 100).toFixed(1)}%)"
          />
        {/each}
      </svg>

      {#if showLegend}
        <div class="pie-legend">
          {#each data as item, index}
            <div class="legend-item">
              <div class="legend-color" style="background-color: {getColor(index)}"></div>
              <span class="legend-label">{item.label}: {formatValue(item.value)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 1rem;
  }

  .bar-chart {
    display: flex;
    align-items: end;
    justify-content: space-around;
    height: 100%;
    gap: 1rem;
  }

  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }

  .bar-container {
    display: flex;
    align-items: end;
    height: 100%;
    margin: 0.5rem 0;
  }

  .bar {
    width: 40px;
    min-height: 2px;
    border-radius: 4px 4px 0 0;
    transition: opacity 0.2s;
  }

  .bar:hover {
    opacity: 0.8;
  }

  .bar-label {
    font-size: 0.75rem;
    color: #6B7280;
    text-align: center;
    max-width: 60px;
    word-wrap: break-word;
  }

  .bar-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-top: 0.25rem;
  }

  .line-chart {
    position: relative;
  }

  .line-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .line-label {
    font-size: 0.75rem;
    color: #6B7280;
  }

  .pie-chart {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .pie-legend {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .legend-label {
    font-size: 0.875rem;
    color: #374151;
  }
</style>