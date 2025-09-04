$(document).ready(function() {
    let pomodoroTime = 25 * 60; // 25 minutes
    let shortBreakTime = 5 * 60; // 5 minutes
    let longBreakTime = 15 * 60; // 15 minutes
    let timerInterval;
    let pomodoroCount = 0;
    let audio = $("#btnClick")[0];
    let alarm = $("#alarm")[0];
    let totalSeconds;
    let currentTime = pomodoroTime;
    let currentMode = "pomodoro";
    
    // Update display
    function updateDisplay() {
        let minutes = Math.floor(currentTime / 60);
        let seconds = currentTime % 60;
        $('#minutes').text(String(minutes).padStart(2, '0'));
        $('#seconds').text(String(seconds).padStart(2, '0'));
    }

    // Update progress
    function updateProgressBar() {
        let percentage = (1 - (currentTime / totalSeconds)) * 100;
        $('#progressBar').css('width', percentage + '%');
    }

    function startTimer() {
        totalSeconds = parseInt($('#minutes').text()) * 60 + parseInt($('#seconds').text());
        currentTime = totalSeconds;

        timerInterval = setInterval(() => {
            currentTime--;
            updateDisplay();
            updateProgressBar();

            if (currentTime <= 0) {
                alarm.play();
                clearInterval(timerInterval);

                // Switch modes or trigger long break
                if (currentMode === "pomodoro") {
                    pomodoroCount++;
                    if (pomodoroCount % 4 === 0) {
                        switchMode("longBreak");
                    } else {
                        switchMode("shortBreak");
                    }
                } else {
                    switchMode("pomodoro");
                }
                resetPage(); //reset page to initial stage
                updateDisplay();
                updateProgressBar();
                $("#progressBar").width(0);
            }
        }, 1000);
    }
    
    // Reset Page
    function resetPage() {
        switchMode("pomodoro");
        $('#timerWrap').removeClass().addClass('bg-normal');
        $('.modes button').removeClass('active');
        $("#pomodoroBtn").addClass('active');
        $('#startBtn').text('Start');
        updateDisplay();
        resetTimer();
        updateProgressBar();
        $("#progressBar").width(0);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timerInterval);
    }

    // Reset timer
    function resetTimer() {
        pauseTimer();
        if (currentMode === "pomodoro") currentTime = pomodoroTime;
        else if (currentMode === "shortBreak") currentTime = shortBreakTime;
        else if (currentMode === "longBreak") currentTime = longBreakTime;
        updateDisplay();
        updateProgressBar();
        $("#progressBar").width(0);
    }

    // Switch mode
    function switchMode(mode) {
        currentMode = mode;
        resetTimer(); // Reset timer
    }

    // Button clicks
    $('#timerWrap').addClass('bg-normal');
    $('#pomodoroBtn').addClass('active');
    $('.modes button').on('click',function() {
        $('.modes button').removeClass('active'); // Remove 'active' from all buttons in the group
        $(this).addClass('active'); // Add 'active' to the clicked button
    });
    $('#logo, #site').on('click', () => {
        switchMode("pomodoro");
        resetPage();
        updateProgressBar();
    });
    $("#startBtn").click(function() {
        if ($(this).text() == "Start") { 
            $(this).text("Pause");
            startTimer();
        } else { 
            $(this).text("Start");
            pauseTimer();
        }; 
    });
    $("#resetBtn").click(function() {
        resetTimer();
        $('#startBtn').text('Start');
    });

    // Event Listeners
    $('#pomodoroBtn').on('click', () => {
        switchMode("pomodoro");
        resetTimer();
        updateProgressBar();
        $("#progressBar").width(0);
        $('#timerWrap').removeClass().addClass('bg-normal');
        $('#startBtn').text('Start');
    });
    $('#shortBreakBtn').on('click', () => {
        switchMode("shortBreak");
        updateProgressBar();
        $("#progressBar").width(0);
        $('#timerWrap').removeClass().addClass('bg-sbreak');
        $('#startBtn').text('Start');
    });
    $('#longBreakBtn').on('click', () => {
        switchMode("longBreak");
        updateProgressBar();
        $("#progressBar").width(0);
        $('#timerWrap').removeClass().addClass('bg-lbreak');
        $('#startBtn').text('Start');
    });
    
    $(".controls button").click(function() {
        audio.play();
    });

    updateDisplay(); // Initial display setup
    updateProgressBar();
    $("#progressBar").width(0);
});