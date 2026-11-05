<style lang="css">
    #game-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f4f4f4;
        width: 50%;
        height: 70%;
        max-width: 800px;
        border-radius: 5px;
    }

    #puzzle-container {
        display: flex;
        align-items: flex-end; /* bars align to the bottom, growing upward */
        width: 90%;
        height: 83%;
        max-width: 800px; /* don't let it get huge on rly wide monitors */
        min-width: 300px; /* don't let it get too cramped on small screen */
        margin: 20px auto 0;
    }

    #moves-history-box {
        width: 96%;
        margin: 1%;
        padding: 10px;
        background-color: #e8e6e6;
        border-radius: 5px;
        flex-grow: 1; /* takes up all remaining vertical space in #game-area */
    }
</style>