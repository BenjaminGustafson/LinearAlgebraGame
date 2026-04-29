import { TASK_LIST } from "../data/tasks";
import { useUIState } from "../stores/UIState";
import { useGameState } from "../stores/GameState";

export function TaskMenu() {
    const taskMenuOpen = useUIState((state) => state.taskMenuOpen);
    const toggleTaskMenu = useUIState(state => state.toggleTaskMenu)
    const currentTask = useGameState(state => state.currentTask)
    const setCurrentTask = useGameState((state) => state.setCurrentTask);
    const tasksUnlocked = useGameState((state) => state.tasksUnlocked);
    const taskCompletion = useGameState((state) => state.taskCompletion);
    const seed = useGameState(state => state.seed)

    const handleTaskClick = (index: number) => {
        toggleTaskMenu()
        if (currentTask == index) return;
        setCurrentTask(index);
        const task = TASK_LIST[index];
        if (task.loadTask) {
            task.loadTask(seed);
        }
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
                    const bgColor = isLocked ? "#aaa" : (currentTask == index) ? "#bbb" : "transparent"
                    const hoverColor = "#b0b8c1"
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
                                backgroundColor: bgColor,
                                transition: "background-color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!isLocked) e.currentTarget.style.backgroundColor = hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = bgColor;
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

export function checkTaskUnlocks(){
    TASK_LIST.forEach((task, i) => {
        if (!useGameState.getState().tasksUnlocked[i] && task.unlock && task.unlock()){
            useGameState.getState().unlockTask(i)
        }
    })
}