import styles from './NavBar.module.css'

interface Tab {
  id: string
  label: string
}

interface NavBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function NavBar({ tabs, activeTab, onTabChange }: NavBarProps) {
  return (
    <nav className={styles.nav}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
