import { TASK_LIST } from "../data/tasks";
import { useUIState } from "../stores/UIState";
import { useGameState } from "../stores/GameState";

export default function TaskMenu() {
    const taskMenuOpen = useUIState((state) => state.taskMenuOpen);
    const toggleTaskMenu = useUIState(state => state.toggleTaskMenu)
    const setCurrentTask = useGameState((state) => state.setCurrentTask);
    const tasksUnlocked = useGameState((state) => state.tasksUnlocked);
    const taskCompletion = useGameState((state) => state.taskCompletion);
    const seed = useGameState(state => state.seed)

    const handleTaskClick = (index: number) => {
        if (!tasksUnlocked[index]) return;
        setCurrentTask(index);
        const task = TASK_LIST[index];
        if (task.loadTask) {
            task.loadTask(seed);
        }
        toggleTaskMenu()
    };

    return (
        taskMenuOpen && (
            <div
                className="bg-gray-400"
                style={{ position: "absolute", left: 20, top: 120, width: 1880, height: 950 }}
            >
                <p style={{ fontSize: 24, fontWeight: "bold", padding: "12px 16px" }}>Tasks</p>
                {TASK_LIST.map((task, index) => {
                    const isLocked = !tasksUnlocked[index];
                    return (
                        <div
                            key={index}
                            onClick={() => handleTaskClick(index)}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "80px 1fr 120px",
                                alignItems: "center",
                                minHeight: 50,
                                padding: "0 16px",
                                fontSize: 22,
                                cursor: isLocked ? "default" : "pointer",
                                color: isLocked ? "#888" : "inherit",
                                backgroundColor: isLocked ? "#aaa" : "transparent",
                                transition: "background-color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!isLocked) e.currentTarget.style.backgroundColor = "#b0b8c1";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isLocked ? "#aaa" : "transparent";
                            }}
                        >
                            <span>{index + 1}</span>
                            <span>
                                {task.title}
                                {isLocked && task.unlockText && (
                                    <div style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
                                        To unlock: {task.unlockText}
                                    </div>
                                )}
                            </span>
                            <span style={{ textAlign: "right" }}>
                                {taskCompletion[index] ?? 0}
                            </span>
                        </div>
                    );
                })}
            </div>
        )
    );
}